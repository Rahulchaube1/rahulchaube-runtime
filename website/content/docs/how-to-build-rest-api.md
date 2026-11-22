## Add a POST route

Start in the `hello` directory from [Create a web app](/docs/tutorials-first-steps). Append this handler to `app.ts` below the starter routes. The file already imports `json` and exports `app`.

```ts
app.post("/greetings", ({ body }) => {
  let input: unknown;
  try {
    input = JSON.parse(body);
  } catch {
    return json({ error: "Expected JSON" }, 400);
  }

  if (typeof input !== "object" || input === null ||
      !("name" in input) || typeof input.name !== "string" ||
      !input.name.trim()) {
    return json({ error: "A name is required" }, 400);
  }
  return json({ hello: input.name.trim() }, 201);
});
```

RC Web passes the request body as text. The handler parses it, checks the name and returns a JSON response with an explicit status.

## Send a request

Start the service with `rc run --watch server.ts`. In a second Bash terminal, send a JSON body.

```sh
curl -i http://127.0.0.1:3000/greetings -H 'Content-Type: application/json' -d '{"name":"Ada"}'
```

In PowerShell, use the built-in web client.

```powershell
Invoke-RestMethod -Method Post -Uri http://127.0.0.1:3000/greetings -ContentType application/json -Body '{"name":"Ada"}'
```

The route responds with HTTP 201 and `{"hello":"Ada"}`. Try an empty object for a 400 response. Stop the server with Ctrl+C.

## Check the contract

Keep both branches when you add tests. The client needs a predictable response for valid input and a useful error for a missing name. [Test your service](/docs/testing) · [RC Web reference](/docs/rc-web)
