// examples/library/src/index.ts
function greet(name) {
  return `Hello, ${name}! \u2014 powered by RC Runtime`;
}
function sum(...ns) {
  return ns.reduce((a, b) => a + b, 0);
}
export {
  greet,
  sum
};
