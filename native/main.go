// RC Runtime's standalone command. The compatibility CLI is shipped separately.
package main

import (
	"embed"
	"errors"
	"fmt"
	"io"
	"io/fs"
	"os"
	"path/filepath"
	"runtime"
	"strings"
)

//go:embed VERSION modules/*.js starter/*
var sources embed.FS

var version = strings.TrimSpace(source("VERSION"))

func source(name string) string {
	data, err := sources.ReadFile(name)
	if err != nil {
		panic(err)
	}
	return string(data)
}

const help = `RC Runtime (RahulChaube Runtime)

  rc run [--watch] <file> [--] [args...]    Run JavaScript or TypeScript
  rc build [--watch] <file> --outfile <file>     Bundle an application or ES module
  rc test [files...]                   Run tests in isolated JS contexts
  rc init <directory>                  Create an RC Web application with tests
  rc install [--offline]               Install pinned ES modules from rc.json
  rc doctor                            Show the runtime version and platform
  rc --version                         Print the version
`

func main() {
	if err := command(os.Args[1:]); err != nil {
		fmt.Fprintln(os.Stderr, "rc:", err)
		os.Exit(1)
	}
}

func command(args []string) error {
	if len(args) == 0 {
		fmt.Print(help)
		return nil
	}
	tail := args[1:]
	switch args[0] {
	case "__run-compiled":
		if len(tail) < 1 {
			return errors.New("missing script name")
		}
		data, err := io.ReadAll(os.Stdin)
		if err != nil {
			return err
		}
		return evalProgram(tail[0], string(data), tail[1:])
	case "__activate":
		if len(tail) != 2 {
			return errors.New("expected staging and installation directories")
		}
		return activate(tail[0], tail[1])
	case "--version", "-v":
		fmt.Println("RC Runtime v" + version)
	case "--help", "-h", "help":
		fmt.Print(help)
	case "doctor":
		fmt.Printf("RC Runtime v%s\nPlatform %s/%s\nJavaScript QuickJS-NG\nCompiler esbuild\n", version, runtime.GOOS, runtime.GOARCH)
	case "run":
		live := len(tail) > 0 && tail[0] == "--watch"
		if live {
			tail = tail[1:]
		}
		if len(tail) == 0 {
			return errors.New("usage: rc run [--watch] <file> [--] [args...]")
		}
		argv := tail[1:]
		if len(argv) > 0 && argv[0] == "--" {
			argv = argv[1:]
		}
		if live {
			return watch(tail[0], "", argv)
		}
		return execute(tail[0], argv, false)
	case "build":
		live := len(tail) > 0 && tail[0] == "--watch"
		if live {
			tail = tail[1:]
		}
		if len(tail) != 3 || tail[1] != "--outfile" {
			return errors.New("usage: rc build [--watch] <file> --outfile <file>")
		}
		if live {
			return watch(tail[0], tail[2], nil)
		}
		_, err := bundle(tail[0], tail[2], false)
		return err
	case "test":
		return testFiles(tail)
	case "init":
		if len(tail) != 1 {
			return errors.New("usage: rc init <new directory>")
		}
		return scaffold(tail[0])
	case "install":
		if len(tail) > 1 || (len(tail) == 1 && tail[0] != "--offline") {
			return errors.New("usage: rc install [--offline]")
		}
		return installModules(len(tail) == 1)
	default:
		return fmt.Errorf("unknown command %q (see rc --help)", args[0])
	}
	return nil
}

func scaffold(dir string) error {
	if err := os.Mkdir(dir, 0755); err != nil {
		return err
	}
	entries, err := sources.ReadDir("starter")
	if err != nil {
		return err
	}
	for _, entry := range entries {
		if err := os.WriteFile(filepath.Join(dir, entry.Name()), []byte(source("starter/"+entry.Name())), 0644); err != nil {
			return err
		}
	}
	fmt.Printf("Created %s\n  cd %q\n  rc test\n  rc run server.ts\n", dir, dir)
	return nil
}

func testFiles(files []string) error {
	if len(files) == 0 {
		err := filepath.WalkDir(".", func(path string, entry fs.DirEntry, err error) error {
			if err != nil {
				return err
			}
			name := entry.Name()
			if entry.IsDir() && path != "." && (strings.HasPrefix(name, ".") || name == "node_modules" || name == "dist") {
				return filepath.SkipDir
			}
			stem := strings.TrimSuffix(name, filepath.Ext(name))
			if entry.Type().IsRegular() && (strings.HasSuffix(stem, ".test") || strings.HasSuffix(stem, ".spec")) {
				switch filepath.Ext(name) {
				case ".js", ".mjs", ".cjs", ".ts", ".mts", ".cts", ".jsx", ".tsx":
					files = append(files, path)
				}
			}
			return nil
		})
		if err != nil {
			return err
		}
	}
	if len(files) == 0 {
		return errors.New("no test files found (use *.test.ts or pass a filename)")
	}
	var failures []error
	for _, file := range files {
		fmt.Println(file)
		if err := execute(file, nil, true); err != nil {
			failures = append(failures, fmt.Errorf("%s: %w", file, err))
		}
	}
	return errors.Join(failures...)
}
