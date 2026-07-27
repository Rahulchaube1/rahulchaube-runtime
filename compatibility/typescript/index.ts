function processConfig(cfg: any) {
  return { success: true, data: cfg.options };
}

const res = processConfig({ target: "ES2024", options: { strict: true } });
console.log(JSON.stringify(res));
