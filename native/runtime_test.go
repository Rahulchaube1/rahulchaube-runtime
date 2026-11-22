package main

import (
	"crypto/sha256"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"
)

func fixture(t *testing.T, dir, name, content string) string {
	t.Helper()
	path := filepath.Join(dir, name)
	if err := os.WriteFile(path, []byte(content), 0644); err != nil {
		t.Fatal(err)
	}
	return path
}

func TestStandaloneModuleGraph(t *testing.T) {
	dir := t.TempDir()
	fixture(t, dir, "data.json", `{"answer":42}`)
	fixture(t, dir, "legacy.cjs", "module.exports = 2")
	fixture(t, dir, "calc.ts", "export const add = (a: number, b: number): number => a+b;")
	main := fixture(t, dir, "app.ts", `
		import data from "./data.json";
		import value from "./legacy.cjs";
		import {equal} from "rc:test";
		const {add} = await import("./calc.ts");
		await new Promise(resolve => setTimeout(resolve, 2));
		equal(add(40,value),data.answer);
		equal(RC.args.join("|"), "two words|--flag");
	`)
	args := []string{"two words", "--flag"}
	if err := execute(main, args, false); err != nil {
		t.Fatal(err)
	}
	out := filepath.Join(dir, "out.mjs")
	if _, err := bundle(main, out, false); err != nil {
		t.Fatal(err)
	}
	if err := execute(out, args, false); err != nil {
		t.Fatal(err)
	}
}

func TestFailuresReachCLI(t *testing.T) {
	tests := []struct{ name, source, message string }{
		{"sync.js", "throw new Error('sync failure')", "sync failure"},
		{"async.mjs", "await Promise.reject(new Error('async failure'))", "async failure"},
		{"unhandled.js", "Promise.reject(new Error('unhandled failure'))", "unhandled failure"},
		{"timer.js", "setTimeout(() => {throw new Error('timer failure')},1)", "timer failure"},
		{"idle.mjs", "await new Promise(() => {})", "pending"},
		{"broken.ts", "const a: =", "ERROR"},
	}
	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			err := execute(fixture(t, t.TempDir(), tc.name, tc.source), nil, false)
			if err == nil || !strings.Contains(err.Error(), tc.message) {
				t.Fatalf("got %v, want %q", err, tc.message)
			}
		})
	}
}

func TestScaffoldAndFileLibrary(t *testing.T) {
	dir := filepath.Join(t.TempDir(), "project")
	if err := scaffold(dir); err != nil {
		t.Fatal(err)
	}
	if err := scaffold(dir); err == nil {
		t.Fatal("overwrote an existing project")
	}
	if err := execute(filepath.Join(dir, "app.test.ts"), nil, true); err != nil {
		t.Fatal(err)
	}
	probe := fixture(t, dir, "fs.test.ts", `
		import {readJSON,writeJSON} from "rc:fs";
		import {equal,test} from "rc:test";
		test("round trip", () => {writeJSON(RC.args[0], {x:3}); equal(readJSON(RC.args[0]).x,3)});
	`)
	if err := execute(probe, []string{filepath.Join(dir, "file.json")}, true); err != nil {
		t.Fatal(err)
	}
	if err := execute(fixture(t, dir, "fail.test.ts", `import {test,equal} from "rc:test"; test("bad",()=>equal(1,2));`), nil, true); err == nil {
		t.Fatal("failed assertion returned success")
	}
}

func TestPinnedModuleInstall(t *testing.T) {
	dir := t.TempDir()
	body := "export const answer = 42"
	server := httptest.NewTLSServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { fmt.Fprint(w, body) }))
	defer server.Close()
	dep := dependency{URL: server.URL, SHA256: fmt.Sprintf("%x", sha256.Sum256([]byte(body)))}
	cache := filepath.Join(dir, "cache", "module")
	dest := modulePath(dir, dep.SHA256)
	if err := fetchModule(server.Client(), dep, cache, dest, false); err != nil {
		t.Fatal(err)
	}
	if err := os.Remove(dest); err != nil {
		t.Fatal(err)
	}
	if err := fetchModule(server.Client(), dep, cache, dest, true); err != nil {
		t.Fatal(err)
	}
	fixture(t, dir, "rc.json", fmt.Sprintf(`{"dependencies":{"library":{"url":%q,"sha256":%q}}}`, dep.URL, dep.SHA256))
	if err := execute(fixture(t, dir, "main.ts", `import {answer} from "library"; if(answer!==42) throw Error("import")`), nil, false); err != nil {
		t.Fatal(err)
	}
	dep.SHA256 = strings.Repeat("0", 64)
	if err := fetchModule(server.Client(), dep, cache, dest, false); err == nil {
		t.Fatal("accepted a mismatched digest")
	}
	data, _ := os.ReadFile(dest)
	if string(data) != body {
		t.Fatal("overwrote a valid module on failure")
	}
}

func TestInstallFetchesDistinctDigestsConcurrently(t *testing.T) {
	arrivals := make(chan string, 3)
	release := make(chan struct{})
	server := httptest.NewTLSServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		arrivals <- r.URL.Path
		<-release
		fmt.Fprint(w, r.URL.Path)
	}))
	defer server.Close()
	released := false
	defer func() {
		if !released {
			close(release)
		}
	}()
	pin := func(path string) dependency {
		return dependency{URL: server.URL + path, SHA256: fmt.Sprintf("%x", sha256.Sum256([]byte(path)))}
	}
	deps := map[string]dependency{"alpha": pin("/a"), "alias": pin("/a"), "beta": pin("/b")}
	names := []string{"alias", "alpha", "beta"}
	dir, cache := t.TempDir(), t.TempDir()
	finished := make(chan error, 1)
	go func() { finished <- installDependencies(names, deps, dir, cache, server.Client(), false) }()
	paths := make(map[string]bool)
	for range 2 {
		select {
		case path := <-arrivals:
			paths[path] = true
		case <-time.After(5 * time.Second):
			t.Fatal("distinct modules must download concurrently")
		}
	}
	close(release)
	released = true
	if err := <-finished; err != nil {
		t.Fatal(err)
	}
	if !paths["/a"] || !paths["/b"] || len(arrivals) != 0 {
		t.Fatal("expected one request per digest", paths)
	}
	for _, dep := range deps {
		data, err := os.ReadFile(modulePath(dir, dep.SHA256))
		if err != nil || !matches(data, dep.SHA256) {
			t.Fatal("missing verified module", dep.URL, err)
		}
	}
}
