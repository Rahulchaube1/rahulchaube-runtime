const noConsoleRule = {
  name: "no-console",
  check(code: string) {
    return !code.includes("console.log");
  },
};

console.log(JSON.stringify({ rule: noConsoleRule.name, ok: noConsoleRule.check("const a = 1;") }));
