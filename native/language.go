package main

import (
	"archive/zip"
	"bytes"
	"compress/gzip"
	_ "embed"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/fs"
	"os"
	"path/filepath"
	"runtime"
	"slices"
	"strings"

	js "github.com/buke/quickjs-go"
)

//go:generate go run ./internal/preparets

//go:embed tooling/libraries.zip
var languageLibraries []byte

//go:embed tooling/driver.js
var languageDriver string

type languageRequest struct {
	Command       string   `json:"command"`
	Files         []string `json:"files"`
	Project       string   `json:"project"`
	Cwd           string   `json:"cwd"`
	Lib           string   `json:"lib"`
	CaseSensitive bool     `json:"caseSensitive"`
	Verify        bool     `json:"verify"`
}

type formatEdit struct {
	Path   string
	Before string
	After  string
}

type languageResult struct {
	Error string
	Count int
	Edits []formatEdit
}

func sourceFile(path string) bool {
	switch strings.ToLower(filepath.Ext(path)) {
	case ".js", ".jsx", ".mjs", ".cjs", ".ts", ".tsx", ".mts", ".cts":
		return true
	}
	return false
}

func languageFiles(paths []string) ([]string, error) {
	seen := make(map[string]bool)
	for _, path := range paths {
		abs, err := filepath.Abs(path)
		if err != nil {
			return nil, err
		}
		abs, err = filepath.EvalSymlinks(abs)
		if err != nil {
			return nil, err
		}
		err = filepath.WalkDir(abs, func(name string, entry fs.DirEntry, err error) error {
			if err != nil {
				return err
			}
			if entry.IsDir() {
				if name != abs && (strings.HasPrefix(entry.Name(), ".") || slices.Contains([]string{"node_modules", "dist", "build", "coverage"}, entry.Name())) {
					return filepath.SkipDir
				}
				return nil
			}
			if entry.Type().IsRegular() && sourceFile(name) {
				seen[filepath.ToSlash(name)] = true
			} else if name == abs {
				return fmt.Errorf("unsupported source file %s", path)
			}
			return nil
		})
		if err != nil {
			return nil, err
		}
	}
	names := make([]string, 0, len(seen))
	for name := range seen {
		names = append(names, name)
	}
	slices.Sort(names)
	return names, nil
}

func languageCommand(cmd string, args []string) error {
	cwd, err := os.Getwd()
	if err != nil {
		return err
	}
	req := languageRequest{Command: cmd, Cwd: filepath.ToSlash(cwd), Lib: filepath.ToSlash(filepath.Join(filepath.VolumeName(cwd)+string(os.PathSeparator), "__rc_typescript__")), CaseSensitive: runtime.GOOS != "windows"}
	var paths []string
	for i := 0; i < len(args); i++ {
		arg := args[i]
		switch {
		case arg == "--":
			paths = append(paths, args[i+1:]...)
			i = len(args)
		case cmd == "fmt" && arg == "--check":
			req.Verify = true
		case cmd == "check" && (arg == "--project" || arg == "-p"):
			if req.Project != "" || i+1 == len(args) {
				return errors.New("usage: rc check --project <tsconfig.json or directory>")
			}
			i++
			req.Project = filepath.ToSlash(args[i])
		case strings.HasPrefix(arg, "-"):
			return fmt.Errorf("unknown %s option %s", cmd, arg)
		default:
			paths = append(paths, arg)
		}
	}
	if req.Project != "" && len(paths) > 0 {
		return errors.New("choose a project or source files for rc check")
	}
	if len(paths) == 0 && cmd == "fmt" {
		paths = []string{"."}
	}
	req.Files, err = languageFiles(paths)
	if err != nil {
		return err
	}
	if len(paths) > 0 && len(req.Files) == 0 {
		return errors.New("no JavaScript or TypeScript files found")
	}
	result, err := runLanguageService(req)
	if err != nil {
		return err
	}
	if result.Error != "" {
		return errors.New(result.Error)
	}
	if req.Verify && len(result.Edits) > 0 {
		for _, edit := range result.Edits {
			fmt.Fprintln(os.Stderr, displayPath(cwd, edit.Path))
		}
		return fmt.Errorf("%d file(s) need formatting", len(result.Edits))
	}
	for _, edit := range result.Edits {
		if err := applyFormat(edit); err != nil {
			return err
		}
		fmt.Println("Formatted", displayPath(cwd, edit.Path))
	}
	fmt.Printf("Checked %d source file(s)\n", result.Count)
	return nil
}

func displayPath(cwd, name string) string {
	if relative, err := filepath.Rel(cwd, filepath.FromSlash(name)); err == nil {
		return relative
	}
	return name
}

// Replace only a complete formatted file and preserve edits made after it was read.
func applyFormat(edit formatEdit) error {
	path := filepath.FromSlash(edit.Path)
	info, err := os.Lstat(path)
	if err != nil {
		return err
	}
	if !info.Mode().IsRegular() || info.Mode().Perm()&0222 == 0 {
		return fmt.Errorf("%s is not a writable regular file", path)
	}
	tmp, err := os.CreateTemp(filepath.Dir(path), ".rc-fmt-*")
	if err != nil {
		return err
	}
	defer os.Remove(tmp.Name())
	if err = tmp.Chmod(info.Mode().Perm()); err == nil {
		_, err = io.WriteString(tmp, edit.After)
	}
	closeErr := tmp.Close()
	if err != nil {
		return err
	}
	if closeErr != nil {
		return closeErr
	}
	before, err := os.ReadFile(path)
	if err != nil {
		return err
	}
	if string(before) != edit.Before {
		return fmt.Errorf("%s changed during formatting", path)
	}
	return os.Rename(tmp.Name(), path)
}

func runLanguageService(req languageRequest) (languageResult, error) {
	var result languageResult
	libs, err := zip.NewReader(bytes.NewReader(languageLibraries), int64(len(languageLibraries)))
	if err != nil {
		return result, err
	}
	reader, err := gzip.NewReader(bytes.NewReader(languageCompiler))
	if err != nil {
		return result, err
	}
	defer reader.Close()
	compiler, err := io.ReadAll(reader)
	if err != nil {
		return result, err
	}
	runtime.LockOSThread()
	defer runtime.UnlockOSThread()
	rt := js.NewRuntime()
	defer rt.Close()
	ctx := rt.NewContext()
	if ctx == nil {
		return result, errors.New("could not start the TypeScript service")
	}
	defer ctx.Close()
	engine := loadLanguageCompiler(ctx, compiler)
	defer engine.Free()
	if engine.IsException() {
		return result, jsError(ctx)
	}
	host := ctx.NewObject()
	request, _ := json.Marshal(req)
	host.Set("request", ctx.ParseJSON(string(request)))
	// The compiler and RC declarations live in a virtual read-only directory.
	library := func(name string) (string, bool) {
		if !strings.HasPrefix(name, req.Lib+"/") {
			return "", false
		}
		return strings.TrimPrefix(name, req.Lib+"/"), true
	}
	bind(ctx, host, "read", 1, func(c *js.Context, _ *js.Value, args []*js.Value) *js.Value {
		name := args[0].ToString()
		var data []byte
		var err error
		if lib, ok := library(name); ok {
			if lib == "rc.d.ts" {
				return c.NewString(source("starter/rc.d.ts"))
			}
			data, err = fs.ReadFile(libs, lib)
		} else {
			data, err = os.ReadFile(filepath.FromSlash(name))
		}
		if err != nil {
			if errors.Is(err, fs.ErrNotExist) {
				return c.NewUndefined()
			}
			return c.ThrowError(fmt.Errorf("%s: %w", name, err))
		}
		return c.NewString(string(data))
	})
	bind(ctx, host, "kind", 1, func(c *js.Context, _ *js.Value, args []*js.Value) *js.Value {
		name := args[0].ToString()
		if name == req.Lib {
			return c.NewInt32(2)
		}
		if lib, ok := library(name); ok {
			if lib == "rc.d.ts" {
				return c.NewInt32(1)
			}
			if _, err := fs.Stat(libs, lib); err == nil {
				return c.NewInt32(1)
			}
			return c.NewInt32(0)
		}
		info, err := os.Stat(filepath.FromSlash(name))
		if err != nil {
			return c.NewInt32(0)
		}
		if info.IsDir() {
			return c.NewInt32(2)
		}
		if info.Mode().IsRegular() {
			return c.NewInt32(1)
		}
		return c.NewInt32(0)
	})
	bind(ctx, host, "entries", 1, func(c *js.Context, _ *js.Value, args []*js.Value) *js.Value {
		name := filepath.FromSlash(args[0].ToString())
		files, dirs := []string{}, []string{}
		entries, err := os.ReadDir(name)
		if err != nil && !errors.Is(err, fs.ErrNotExist) {
			return c.ThrowError(err)
		}
		for _, entry := range entries {
			mode := entry.Type()
			if mode&os.ModeSymlink != 0 {
				info, err := os.Stat(filepath.Join(name, entry.Name()))
				if err != nil {
					continue
				}
				mode = info.Mode()
			}
			if mode.IsDir() {
				dirs = append(dirs, entry.Name())
			} else if mode.IsRegular() {
				files = append(files, entry.Name())
			}
		}
		value, _ := json.Marshal(map[string][]string{"files": files, "directories": dirs})
		return c.ParseJSON(string(value))
	})
	bind(ctx, host, "realpath", 1, func(c *js.Context, _ *js.Value, args []*js.Value) *js.Value {
		path := args[0].ToString()
		if full, err := filepath.EvalSymlinks(filepath.FromSlash(path)); err == nil {
			path = filepath.ToSlash(full)
		}
		return c.NewString(path)
	})
	ctx.Globals().Set("rcCompiler", host)
	report := ctx.Eval(languageDriver, js.EvalFileName("rc-language.js"))
	defer report.Free()
	if report.IsException() {
		return result, jsError(ctx)
	}
	err = json.Unmarshal([]byte(report.JSONStringify()), &result)
	return result, err
}
