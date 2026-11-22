export const helloExample = {
  source: 'const name: string = RC.args[0] ?? "world";\nconsole.log("Hello, " + name + "!");',
  args: ["run", "hello.ts", "--", "Rahul"],
  output: "Hello, Rahul!",
} as const;
