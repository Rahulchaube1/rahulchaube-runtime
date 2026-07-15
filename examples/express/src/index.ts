import express from "express";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.get("/", (_req, res) => {
  res.json({ name: "rahulchaube-express-example", runtime: "RahulChaube Runtime" });
});

app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
