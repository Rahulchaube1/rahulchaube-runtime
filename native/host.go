package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"time"

	js "github.com/buke/quickjs-go"
)

type nativeFunc func(*js.Context, *js.Value, []*js.Value) *js.Value

func bind(ctx *js.Context, obj *js.Value, name string, arity int, fn nativeFunc) {
	obj.Set(name, ctx.NewFunction(func(c *js.Context, this *js.Value, args []*js.Value) *js.Value {
		if len(args) != arity {
			return c.ThrowTypeError("%s expects %d arguments", name, arity)
		}
		return fn(c, this, args)
	}))
}

func jsError(ctx *js.Context) error {
	err := ctx.Exception()
	var report *js.Error
	if errors.As(err, &report) && report.Stack != "" {
		return fmt.Errorf("%w\n%s", err, report.Stack)
	}
	if err == nil {
		return errors.New("JavaScript execution failed")
	}
	return err
}

func execute(file string, args []string, test bool) error {
	code, err := loadProgram(file, test)
	if err != nil {
		return err
	}
	runtime.LockOSThread()
	defer runtime.UnlockOSThread()
	rt := js.NewRuntime()
	defer rt.Close()
	ctx := rt.NewContext()
	if ctx == nil {
		return errors.New("could not initialize QuickJS")
	}
	defer ctx.Close()
	h := newHTTPHost(ctx)
	defer h.shutdown()
	host := ctx.NewObject()
	if args == nil {
		args = []string{}
	}
	argv, _ := json.Marshal(args)
	host.Set("args", ctx.ParseJSON(string(argv)))
	host.Set("version", ctx.NewString(version))
	bind(ctx, host, "print", 2, func(c *js.Context, _ *js.Value, a []*js.Value) *js.Value {
		out := os.Stdout
		if a[0].ToBool() {
			out = os.Stderr
		}
		fmt.Fprintln(out, a[1].ToString())
		return c.NewUndefined()
	})
	bind(ctx, host, "readText", 1, func(c *js.Context, _ *js.Value, a []*js.Value) *js.Value {
		data, err := os.ReadFile(a[0].ToString())
		if err != nil {
			return c.ThrowError(err)
		}
		return c.NewString(string(data))
	})
	bind(ctx, host, "writeText", 2, func(c *js.Context, _ *js.Value, a []*js.Value) *js.Value {
		if err := os.WriteFile(a[0].ToString(), []byte(a[1].ToString()), 0644); err != nil {
			return c.ThrowError(err)
		}
		return c.NewUndefined()
	})
	h.bind(host)
	ctx.Globals().Set("__rcHost", host)
	bridge := ctx.Eval(source("modules/host.js"))
	defer bridge.Free()
	if bridge.IsException() {
		return jsError(ctx)
	}
	h.bridge = bridge
	entry, err := filepath.Abs(file)
	if err != nil {
		return err
	}
	result := ctx.Eval(code, js.EvalFlagModule(true), js.EvalFileName(entry))
	defer result.Free()
	if result.IsException() {
		return jsError(ctx)
	}

	for {
		delay := ctx.LoopOnce()
		if delay == -2 || ctx.HasException() {
			return jsError(ctx)
		}
		// Report unhandled rejections after draining this turn's microtasks.
		check := ctx.Eval("void 0", js.EvalAwait(true))
		failed := check.IsException()
		check.Free()
		if failed {
			return jsError(ctx)
		}
		if h.err != nil {
			return h.err
		}
		if delay < 0 && len(h.listeners) == 0 && len(h.pending) == 0 {
			switch result.PromiseState() {
			case js.PromisePending:
				return errors.New("top-level await is pending with no active timers or servers")
			case js.PromiseRejected:
				reason := result.PromiseResult()
				defer reason.Free()
				return errors.New(reason.ToString())
			}
			return nil
		}
		if delay == 0 {
			continue
		}
		var tick <-chan time.Time
		var timer *time.Timer
		if delay > 0 {
			timer = time.NewTimer(time.Duration(delay) * time.Millisecond)
			tick = timer.C
		}
		select {
		case event := <-h.events:
			event()
		case <-tick:
		}
		if timer != nil {
			timer.Stop()
		}
	}
}
