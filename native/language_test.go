package main

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestFormatPreservesTypesCommentsAndLineEndings(t *testing.T) {
	dir := t.TempDir()
	name := fixture(t, dir, "example.ts", "\ufeff// café\r\nconst greeting:string=\"👋\"\r\n")
	if err := languageCommand("fmt", []string{"--check", dir}); err == nil {
		t.Fatal("check accepted unformatted input")
	}
	read := func() string {
		t.Helper()
		data, err := os.ReadFile(name)
		if err != nil {
			t.Fatal(err)
		}
		return string(data)
	}
	if !strings.Contains(read(), "greeting:string=") {
		t.Fatal("check rewrote input")
	}
	if err := languageCommand("fmt", []string{dir, name}); err != nil {
		t.Fatal(err)
	}
	if got := read(); got != "\ufeff// café\r\nconst greeting: string = \"👋\"\r\n" {
		t.Fatalf("unexpected result %q", got)
	}
	if err := languageCommand("fmt", []string{"--check", name}); err != nil {
		t.Fatal(err)
	}
	bad := fixture(t, dir, "broken.ts", "const number: =")
	if err := languageCommand("fmt", []string{bad}); err == nil {
		t.Fatal("formatted malformed syntax")
	}
}

func TestCheckUsesProjectTypesWithoutExecution(t *testing.T) {
	dir := t.TempDir()
	fixture(t, dir, "tsconfig.json", `{"compilerOptions":{"strict":true},"include":["*.ts"],"exclude":["excluded.ts"]}`)
	fixture(t, dir, "value.ts", `export const value: number = 21;`)
	fixture(t, dir, "excluded.ts", `const bad: string = 22;`)
	entry := fixture(t, dir, "main.ts", `import {value} from "./value"; import {writeText} from "rc:fs"; writeText("should-never-run.txt", "no"); const result: number = value;`)
	if err := languageCommand("check", []string{"-p", dir}); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(entry, []byte(`import {value} from "./value"; const result: string = value;`), 0600); err != nil {
		t.Fatal(err)
	}
	if err := languageCommand("check", []string{"--project", filepath.Join(dir, "tsconfig.json")}); err == nil || !strings.Contains(err.Error(), "TS2322") {
		t.Fatalf("missing semantic diagnostic: %v", err)
	}
	if _, err := os.Stat("should-never-run.txt"); !os.IsNotExist(err) {
		t.Fatal("type checking executed the entry")
	}
}

func TestFormattingChecksAllInputsBeforeWriting(t *testing.T) {
	dir := t.TempDir()
	good := fixture(t, dir, "a.ts", "const n:number=5")
	fixture(t, dir, "z.ts", "let n: =")
	if err := languageCommand("fmt", []string{dir}); err == nil {
		t.Fatal("expected parser error")
	}
	data, _ := os.ReadFile(good)
	if string(data) != "const n:number=5" {
		t.Fatal("modified a file before validating the remaining inputs")
	}
}

func TestTransformKeepsProjectSettings(t *testing.T) {
	dir := t.TempDir()
	entry := fixture(t, dir, "standalone.ts", `const n: number = 21; if (n * 2 !== 42) throw Error("wrong output")`)
	if err := execute(entry, nil, false); err != nil {
		t.Fatal(err)
	}
	fixture(t, dir, "rc.json", "{ broken")
	if err := execute(entry, nil, false); err == nil {
		t.Fatal("fast path ignored an invalid project configuration")
	}
}

func TestCheckDiagnosesErrorsInProjectDeclarations(t *testing.T) {
	dir := t.TempDir()
	fixture(t, dir, "tsconfig.json", `{"include":["*.ts"]}`)
	fixture(t, dir, "main.ts", "export const n = 42;")
	fixture(t, dir, "custom.d.ts", "export type Broken = MissingType;")
	if err := languageCommand("check", []string{"-p", dir}); err == nil || !strings.Contains(err.Error(), "TS2304") {
		t.Fatalf("project declaration diagnostic was skipped: %v", err)
	}
}
