package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/evanw/esbuild/pkg/api"
)

// compile both installed libraries and the entry into one ESM graph, preserving
// top-level await and static/dynamic literal imports without a JS host process.
func buildOptions(entry, outfile string, test bool) (api.BuildOptions, error) {
	abs, err := filepath.Abs(entry)
	if err != nil {
		return api.BuildOptions{}, err
	}
	if info, err := os.Stat(abs); err != nil {
		return api.BuildOptions{}, err
	} else if !info.Mode().IsRegular() {
		return api.BuildOptions{}, fmt.Errorf("expected a file: %s", entry)
	}
	options := api.BuildOptions{
		EntryPoints: []string{abs}, Bundle: true, Format: api.FormatESModule, Platform: api.PlatformNeutral,
		Target: api.ES2022, MainFields: []string{"module", "main"}, Conditions: []string{"rc"},
		Loader: map[string]api.Loader{".mts": api.LoaderTS, ".cts": api.LoaderTS},
		Plugins: []api.Plugin{{Name: "rc", Setup: func(build api.PluginBuild) {
			build.OnResolve(api.OnResolveOptions{Filter: "^rc:"}, func(args api.OnResolveArgs) (api.OnResolveResult, error) {
				switch args.Path {
				case "rc:web", "rc:test", "rc:fs":
					// Built bundles import RC's modules at run time too.
					return api.OnResolveResult{Path: args.Path, Namespace: "rc", External: outfile != ""}, nil
				default:
					return api.OnResolveResult{}, fmt.Errorf("unknown built-in module %q", args.Path)
				}
			})
			build.OnLoad(api.OnLoadOptions{Filter: ".*", Namespace: "rc"}, func(args api.OnLoadArgs) (api.OnLoadResult, error) {
				body := source("modules/" + strings.TrimPrefix(args.Path, "rc:") + ".js")
				return api.OnLoadResult{Contents: &body, Loader: api.LoaderJS}, nil
			})
		}}},
	}
	configDir, config, err := findConfig(filepath.Dir(abs))
	if err != nil {
		return api.BuildOptions{}, err
	}
	if config != nil {
		options.Alias = make(map[string]string, len(config.Dependencies))
		for name, dep := range config.Dependencies {
			options.Alias[name] = modulePath(configDir, dep.SHA256)
		}
	}
	if test {
		quoted, _ := json.Marshal("./" + filepath.Base(abs))
		options.EntryPoints = nil
		options.Stdin = &api.StdinOptions{Contents: "import " + string(quoted) + "; import { runTests } from 'rc:test'; await runTests();", ResolveDir: filepath.Dir(abs), Sourcefile: "rc-test.mjs", Loader: api.LoaderJS}
	}
	if outfile != "" {
		options.Outfile, err = filepath.Abs(outfile)
		if err != nil {
			return api.BuildOptions{}, err
		}
		options.Write = true
	}
	return options, nil
}

func bundle(entry, outfile string, test bool) (string, error) {
	options, err := buildOptions(entry, outfile, test)
	if err != nil {
		return "", err
	}
	result := api.Build(options)
	if len(result.Errors) > 0 {
		return "", errors.New(strings.TrimSpace(strings.Join(api.FormatMessages(result.Errors, api.FormatMessagesOptions{Kind: api.ErrorMessage}), "\n")))
	}
	if outfile != "" {
		return "", nil
	}
	return string(result.OutputFiles[0].Contents), nil
}

// A self-contained ES script needs no package resolution or transformation.
// Defer to esbuild for every possible module edge or CommonJS binding. False
// positives in comments and strings just use the general compilation path.
func loadProgram(entry string, test bool) (string, error) {
	ext := filepath.Ext(entry)
	if !test && (ext == ".js" || ext == ".mjs" || ext == ".ts" || ext == ".mts") {
		data, err := os.ReadFile(entry)
		if err != nil {
			return "", err
		}
		standalone := true
		for _, marker := range []string{"import", "export", "require", "module", "__filename", "__dirname", "\\", "#!", "using "} {
			if bytes.Contains(data, []byte(marker)) {
				standalone = false
				break
			}
		}
		if standalone {
			if ext == ".js" || ext == ".mjs" {
				return string(data), nil
			}
			// A project config can change TypeScript emit, even for a single file.
			// Keep configured entries on the normal resolver and compiler path.
			if !hasProjectSettings(entry) {
				result := api.Transform(string(data), api.TransformOptions{
					Sourcefile: entry, Loader: api.LoaderTS, Format: api.FormatESModule, Target: api.ES2022,
				})
				if len(result.Errors) == 0 {
					return string(result.Code), nil
				}
			}
		}
	}
	return bundle(entry, "", test)
}

func hasProjectSettings(entry string) bool {
	abs, err := filepath.Abs(entry)
	if err != nil {
		return true
	}
	for dir := filepath.Dir(abs); ; dir = filepath.Dir(dir) {
		for _, name := range []string{"rc.json", "tsconfig.json", "package.json"} {
			if _, err := os.Stat(filepath.Join(dir, name)); !errors.Is(err, os.ErrNotExist) {
				return true
			}
		}
		if filepath.Dir(dir) == dir {
			return false
		}
	}
}
