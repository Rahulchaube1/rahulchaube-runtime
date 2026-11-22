// Generate trusted QuickJS bytecode using the same engine on the release target.
package main

import (
	"compress/gzip"
	"errors"
	"io"
	"log"
	"os"
	"runtime"

	js "github.com/buke/quickjs-go"
	"github.com/evanw/esbuild/pkg/api"
)

func prepare() error {
	file, err := os.Open("tooling/typescript.js.gz")
	if err != nil {
		return err
	}
	defer file.Close()
	reader, err := gzip.NewReader(file)
	if err != nil {
		return err
	}
	defer reader.Close()
	source, err := io.ReadAll(reader)
	if err != nil {
		return err
	}
	runtime.LockOSThread()
	defer runtime.UnlockOSThread()
	rt := js.NewRuntime()
	defer rt.Close()
	ctx := rt.NewContext()
	defer ctx.Close()
	compact := api.Transform(string(source), api.TransformOptions{Target: api.ES2022, MinifyWhitespace: true, MinifySyntax: true, MinifyIdentifiers: true, LegalComments: api.LegalCommentsNone})
	if len(compact.Errors) != 0 {
		return errors.New(compact.Errors[0].Text)
	}
	code, err := ctx.Compile(string(compact.Code), js.EvalFileName("typescript.js"))
	if err != nil {
		return err
	}
	output, err := os.Create("tooling/typescript.qbc.gz")
	if err != nil {
		return err
	}
	defer output.Close()
	writer, err := gzip.NewWriterLevel(output, gzip.BestCompression)
	if err != nil {
		return err
	}
	if _, err := writer.Write(code); err != nil {
		return err
	}
	return writer.Close()
}

func main() {
	if err := prepare(); err != nil {
		log.Fatal(err)
	}
}
