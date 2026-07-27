async function handleGet(request) {
  return {
    status: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ message: "Next.js App Router Route Handler", url: request.url }),
  };
}

handleGet({ url: "https://rahulchaube.space/api/next" }).then((res) => {
  console.log(res.body);
});
