## Scaffold the project

From the directory where you keep projects, create a new application. Choose a fresh directory name if `hello` already exists.

```sh
rc init hello
cd hello
rc test
```

Look for `pass greets a visitor by name`. The starter defines the application in `app.ts` and starts its listener in `server.ts`. This separation lets the tests call the router directly.

## Start the server

Keep the first terminal open while the process is running.

```sh
rc run server.ts
```

Open [the local greeting](http://127.0.0.1:3000/hello/Rahul) in a browser or make a request from a second terminal.

```sh
curl http://127.0.0.1:3000/hello/Rahul
```

The response is `{"hello":"Rahul"}`. Replace `Rahul` in the URL with another name. The `:name` segment in the route supplies the value.

## Read the route

The starter registers this handler in `app.ts`.

```ts
app.get("/hello/:name", ({ params }) => json({ hello: params.name }));
```

Return to the server terminal and press Ctrl+C. Keep this project for the next lesson. [Add an HTTP endpoint](/docs/how-to-build-rest-api)
