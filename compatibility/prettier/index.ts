function formatCode(source: string): string {
  return source
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .join("\n");
}

const formatted = formatCode("  const a = 1; \n   const b = 2;  ");
console.log(JSON.stringify({ formatted }));
