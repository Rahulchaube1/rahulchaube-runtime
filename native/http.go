package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net"
	"net/http"
	"strconv"
	"strings"
	"sync/atomic"
	"time"

	js "github.com/buke/quickjs-go"
)

type webResponse struct {
	Status  int               `json:"status"`
	Headers map[string]string `json:"headers"`
	Body    string            `json:"body"`
}

type httpHost struct {
	ctx       *js.Context
	bridge    *js.Value
	listeners map[int64]net.Listener
	pending   map[int64]chan webResponse
	next      atomic.Int64
	events    chan func()
	done      chan struct{}
	err       error
}

func newHTTPHost(ctx *js.Context) *httpHost {
	return &httpHost{ctx: ctx, listeners: make(map[int64]net.Listener), pending: make(map[int64]chan webResponse), events: make(chan func()), done: make(chan struct{})}
}

func (h *httpHost) shutdown() {
	close(h.done)
	for _, listener := range h.listeners {
		listener.Close()
	}
}

func (h *httpHost) enqueue(ctx context.Context, event func()) bool {
	select {
	case h.events <- event:
		return true
	case <-ctx.Done():
		return false
	case <-h.done:
		return false
	}
}

func (h *httpHost) bind(host *js.Value) {
	bind(h.ctx, host, "listen", 2, func(c *js.Context, _ *js.Value, a []*js.Value) *js.Value {
		ln, err := net.Listen("tcp", net.JoinHostPort(a[0].ToString(), strconv.FormatInt(a[1].ToInt64(), 10)))
		if err != nil {
			return c.ThrowError(err)
		}
		id := h.next.Add(1)
		h.listeners[id] = ln
		server := &http.Server{ReadHeaderTimeout: 5 * time.Second, ReadTimeout: 30 * time.Second, IdleTimeout: 60 * time.Second,
			Handler: http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { h.serveRequest(id, w, r) })}
		go func() {
			err := server.Serve(ln)
			if !errors.Is(err, net.ErrClosed) && !errors.Is(err, http.ErrServerClosed) {
				h.enqueue(context.Background(), func() { h.err = err })
			}
		}()
		info := c.NewObject()
		info.Set("id", c.NewInt64(id))
		info.Set("port", c.NewInt64(int64(ln.Addr().(*net.TCPAddr).Port)))
		return info
	})
	bind(h.ctx, host, "close", 1, func(c *js.Context, _ *js.Value, a []*js.Value) *js.Value {
		id := a[0].ToInt64()
		if ln := h.listeners[id]; ln != nil {
			ln.Close()
			delete(h.listeners, id)
		}
		return c.NewUndefined()
	})
	bind(h.ctx, host, "respond", 2, func(c *js.Context, _ *js.Value, a []*js.Value) *js.Value {
		ch := h.pending[a[0].ToInt64()]
		if ch == nil {
			return c.NewUndefined()
		}
		var res webResponse
		if err := json.Unmarshal([]byte(a[1].ToString()), &res); err != nil || res.Status < 200 || res.Status > 599 {
			return c.ThrowTypeError("Handler must return an HTTP response (use text or json)")
		}
		ch <- res
		return c.NewUndefined()
	})
}

func (h *httpHost) serveRequest(server int64, w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	body, err := io.ReadAll(http.MaxBytesReader(w, r.Body, 1<<20))
	if err != nil {
		var large *http.MaxBytesError
		if errors.As(err, &large) {
			http.Error(w, "Request body too large", http.StatusRequestEntityTooLarge)
		} else {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
		}
		return
	}
	headers := make(map[string][]string, len(r.Header))
	for name, values := range r.Header {
		headers[strings.ToLower(name)] = values
	}
	data, _ := json.Marshal(map[string]any{"method": r.Method, "path": r.URL.EscapedPath(), "query": r.URL.Query(), "headers": headers, "body": string(body)})
	id := h.next.Add(1)
	reply := make(chan webResponse, 1)
	ctx, cancel := context.WithTimeout(r.Context(), 30*time.Second)
	defer cancel()
	if !h.enqueue(ctx, func() {
		h.pending[id] = reply
		c := h.ctx
		s, i, req := c.NewInt64(server), c.NewInt64(id), c.ParseJSON(string(data))
		defer s.Free()
		defer i.Free()
		defer req.Free()
		result := h.bridge.Call("dispatch", s, i, req)
		defer result.Free()
		if result.IsException() {
			h.err = jsError(c)
		}
	}) {
		return
	}
	defer h.enqueue(context.Background(), func() { delete(h.pending, id) })
	select {
	case res := <-reply:
		for name, value := range res.Headers {
			w.Header().Set(name, value)
		}
		w.WriteHeader(res.Status)
		fmt.Fprint(w, res.Body)
		http.NewResponseController(w).Flush()
	case <-ctx.Done():
		http.Error(w, "Request timed out", http.StatusGatewayTimeout)
	case <-h.done:
	}
}
