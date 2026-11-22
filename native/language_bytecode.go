//go:build rcprecompiled

package main

import (
	_ "embed"
	js "github.com/buke/quickjs-go"
)

//go:embed tooling/typescript.qbc.gz
var languageCompiler []byte

func loadLanguageCompiler(c *js.Context, data []byte) *js.Value {
	return c.EvalBytecode(data)
}
