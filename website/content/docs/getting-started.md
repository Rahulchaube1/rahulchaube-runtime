## Install the runtime

Download the current release for your operating system. The installer verifies the archive and puts the standalone `rc` command in your user directory. [Installation instructions](/docs/installation) · [Download RC Runtime](/download)

Open a new terminal and run the following commands. The first prints the release number. The second identifies the native platform, JavaScript engine and compiler.

```sh
rc --version
rc doctor
```

## Write a TypeScript program

Create a new file named `hello.ts` in an empty directory. RC passes arguments after the entry filename through `RC.args`.

```ts
const name: string = RC.args[0] ?? "world";
console.log("Hello, " + name + "!");
```

Run it from that directory.

```sh
rc run hello.ts -- Rahul
```

The terminal prints `Hello, Rahul!`. Run it again without an argument to see `Hello, world!`. The type annotation is removed during execution. Run `rc check hello.ts` to check the file with RC’s bundled TypeScript declarations. [Type checking](/docs/check)

## Continue with HTTP

In the next lesson you will create a separate `hello` project with a router and tests. Keep this script as a standalone example. [Create a web app](/docs/tutorials-first-steps)
