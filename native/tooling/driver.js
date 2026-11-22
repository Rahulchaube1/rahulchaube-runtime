// This service runs inside RC's embedded QuickJS, with TypeScript 5.9.3.
(() => {
  const input = rcCompiler.request;
  const files = input.files;
  const absolute = path => ts.getNormalizedAbsolutePath(path, input.cwd);
  const system = {
    args: [], newLine: "\n", useCaseSensitiveFileNames: input.caseSensitive,
    getCurrentDirectory: () => input.cwd,
    getExecutingFilePath: () => input.lib + "/typescript.js",
    readFile: path => rcCompiler.read(absolute(path)),
    fileExists: path => rcCompiler.kind(absolute(path)) === 1,
    directoryExists: path => rcCompiler.kind(absolute(path)) === 2,
    realpath: path => rcCompiler.realpath(absolute(path)),
    getDirectories: path => rcCompiler.entries(absolute(path)).directories,
    write: () => {},
    readDirectory: (path, extensions, excludes, includes, depth) =>
      ts.matchFiles(absolute(path), extensions, excludes, includes, input.caseSensitive, input.cwd, depth,
        dir => rcCompiler.entries(dir), dir => rcCompiler.realpath(dir)),
  };
  ts.setSys(system);

  function diagnostics(items) {
    return ts.formatDiagnostics(ts.sortAndDeduplicateDiagnostics(items), {
      getCurrentDirectory: system.getCurrentDirectory,
      getCanonicalFileName: ts.createGetCanonicalFileName(input.caseSensitive),
      getNewLine: () => "\n",
    }).trimEnd();
  }

  if (input.command === "fmt") {
    const edits = [];
    for (const path of files) {
      const before = system.readFile(path);
      if (before === undefined) return { error: "File disappeared: " + path };
      const bom = before.startsWith("\uFEFF") ? "\uFEFF" : "";
      const text = before.slice(bom.length);
      const source = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true);
      if (source.parseDiagnostics.length) return { error: diagnostics(source.parseDiagnostics) };
      const eol = text.includes("\r\n") ? "\r\n" : "\n";
      const settings = { ...ts.getDefaultFormatCodeSettings(eol), indentSize: 2, tabSize: 2 };
      const context = ts.formatting.getFormatContext(settings, { getNewLine: () => eol });
      const changes = ts.formatting.formatDocument(source, context);
      let after = text;
      for (const { span, newText } of changes.reverse()) {
        after = after.slice(0, span.start) + newText + after.slice(span.start + span.length);
      }
      after = bom + (after ? after.trimEnd() + eol : "");
      if (before !== after) edits.push(input.verify ? { path } : { path, before, after });
    }
    return { count: files.length, edits };
  }

  let config = input.project ? absolute(input.project) : ts.findConfigFile(input.cwd, system.fileExists);
  if (config && system.directoryExists(config)) config = ts.combinePaths(config, "tsconfig.json");
  const defaults = {
    target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler,
    lib: ["lib.es2022.d.ts"], strict: true, allowJs: true, checkJs: true, allowImportingTsExtensions: true,
    // The embedded standard library is versioned with this compiler. User declarations still receive diagnostics.
    skipDefaultLibCheck: true, noEmit: true, types: [],
  };
  let options = defaults;
  let names = files;
  let references;
  if (config) {
    const raw = ts.readConfigFile(config, system.readFile);
    if (raw.error) return { error: diagnostics([raw.error]) };
    const parsed = ts.parseJsonConfigFileContent(raw.config, system, ts.getDirectoryPath(config), undefined, config);
    const errors = parsed.errors.filter(d => !(files.length && d.code === 18003));
    if (errors.length) return { error: diagnostics(errors) };
    options = { ...defaults, ...parsed.options, noEmit: true };
    names = files.length ? [...files, ...parsed.fileNames.filter(n => /\.d\.[cm]?ts$/i.test(n))] : parsed.fileNames;
    references = parsed.projectReferences;
  } else if (!files.length) {
    names = system.readDirectory(input.cwd, [".ts", ".mts", ".cts", ".tsx", ".js", ".mjs", ".cjs", ".jsx"],
      ["**/node_modules", "**/dist", "**/build", "**/coverage", "**/.*"], ["**/*"]);
  }
  if (!names.length) return { error: "No JavaScript or TypeScript source files found." };
  const count = new Set(names.filter(n => !/\.d\.[cm]?ts$/i.test(n))).size;
  // The generated starter already contains the same globals for use by other editors.
  if (!names.some(n => ts.getBaseFileName(n) === "rc.d.ts")) names = [...names, input.lib + "/rc.d.ts"];
  const rcConfig = ts.findConfigFile(config ? ts.getDirectoryPath(config) : input.cwd, system.fileExists, "rc.json");
  if (rcConfig) {
    const manifest = ts.readConfigFile(rcConfig, system.readFile);
    if (manifest.error) return { error: diagnostics([manifest.error]) };
    const paths = { ...options.paths };
    for (const [name, dependency] of Object.entries(manifest.config.dependencies || {})) {
      if (typeof dependency?.sha256 === "string" && /^[0-9a-f]{64}$/.test(dependency.sha256)) {
        paths[name] = [ts.combinePaths(ts.getDirectoryPath(rcConfig), ".rc/modules/" + dependency.sha256 + ".mjs")];
      }
    }
    if (Object.keys(paths).length) options = { ...options, paths };
  }
  const program = ts.createProgram({ rootNames: names, options, projectReferences: references });
  return { count, error: diagnostics(ts.getPreEmitDiagnostics(program)) };
})();
