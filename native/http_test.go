package main

import (
	"bufio"
	"context"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"testing"
	"time"
)

// Start a separate process so a broken event loop cannot hang the Go test suite.
func TestWebListener(t *testing.T) {
	if file := os.Getenv("RC_TEST_WEB_ENTRY"); file != "" {
		if err := execute(file, nil, false); err != nil {
			t.Fatal(err)
		}
		return
	}
	dir := t.TempDir()
	file := fixture(t, dir, "server.ts", `
		import {createApp,json,text} from "rc:web";
		const app = createApp();
		app.get("/hello/:name", async ({params,query}) => {
			await new Promise(resolve=>setTimeout(resolve,2));
			return json({name:params.name,q:query.q[0]});
		});
		app.get("/error",()=>{throw Error("failed handler")});
		app.get("/close",()=>{server.close();return text("bye")});
		const server = app.listen({ port:0 }); console.log(server.port);
	`)
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()
	cmd := exec.CommandContext(ctx, os.Args[0], "-test.run=^TestWebListener$")
	cmd.Dir = filepath.Dir(file)
	cmd.Env = append(os.Environ(), "RC_TEST_WEB_ENTRY="+file)
	out, err := cmd.StdoutPipe()
	if err != nil {
		t.Fatal(err)
	}
	if err := cmd.Start(); err != nil {
		t.Fatal(err)
	}
	defer func() { cancel(); cmd.Wait() }()
	scanner := bufio.NewScanner(out)
	if !scanner.Scan() {
		t.Fatal("missing server port")
	}
	base := "http://127.0.0.1:" + scanner.Text()
	client := &http.Client{Timeout: 5 * time.Second}
	for _, tc := range []struct {
		path   string
		status int
		body   string
	}{
		{"/hello/Rahul%20Chaube?q=abc", 200, `{"name":"Rahul Chaube","q":"abc"}`},
		{"/missing", 404, "Not found"}, {"/error", 500, "Internal Server Error"}, {"/close", 200, "bye"},
	} {
		resp, err := client.Get(base + tc.path)
		if err != nil {
			t.Fatal(err)
		}
		body, err := io.ReadAll(resp.Body)
		resp.Body.Close()
		if err != nil || resp.StatusCode != tc.status || string(body) != tc.body {
			t.Fatalf("%s: %d %q %v", tc.path, resp.StatusCode, body, err)
		}
	}
	if err := cmd.Wait(); err != nil {
		t.Fatal(fmt.Errorf("server shutdown: %w", err))
	}
}
