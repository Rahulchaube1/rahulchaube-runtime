package main

import (
	"bytes"
	"context"
	"fmt"
	"os"
	"os/exec"
	"os/signal"
	"syscall"

	"github.com/evanw/esbuild/pkg/api"
)

// esbuild watches the resolved dependency graph and recovers from bad edits.
// Pass its successful in-memory bundle straight to a new VM process.
func watch(entry, outfile string, args []string) error {
	opts, err := buildOptions(entry, outfile, false)
	if err != nil {
		return err
	}
	executable, err := os.Executable()
	if err != nil {
		return err
	}
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	updates := make(chan []byte, 1)
	opts.LogLevel = api.LogLevelInfo
	if outfile == "" {
		opts.Plugins = append(opts.Plugins, api.Plugin{Name: "rc-watch", Setup: func(build api.PluginBuild) {
			build.OnEnd(func(result *api.BuildResult) (api.OnEndResult, error) {
				if len(result.Errors) == 0 {
					select {
					case updates <- result.OutputFiles[0].Contents:
					case <-ctx.Done():
					}
				}
				return api.OnEndResult{}, nil
			})
		}})
	}
	build, cfgErr := api.Context(opts)
	if cfgErr != nil {
		return cfgErr
	}
	defer func() { stop(); build.Dispose() }()
	if err := build.Watch(api.WatchOptions{}); err != nil {
		return err
	}
	var child *exec.Cmd
	var done chan error
	stopChild := func() {
		if child != nil {
			child.Process.Kill()
			<-done
			child = nil
			done = nil
		}
	}
	defer stopChild()
	for {
		select {
		case <-ctx.Done():
			return nil
		case err := <-done:
			if err != nil {
				fmt.Fprintln(os.Stderr, "rc:", err)
			}
			child = nil
			done = nil
		case code := <-updates:
			stopChild()
			cmd := exec.Command(executable, append([]string{"__run-compiled", entry}, args...)...)
			cmd.Stdin, cmd.Stdout, cmd.Stderr = bytes.NewReader(code), os.Stdout, os.Stderr
			if err := cmd.Start(); err != nil {
				return err
			}
			child, done = cmd, make(chan error, 1)
			go func(exited chan error) { exited <- cmd.Wait() }(done)
		}
	}
}
