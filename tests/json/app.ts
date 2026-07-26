import config from "./config.json";

console.log("App Name:", config.name);
console.log("Port:", config.port);
console.log("Features:", config.features.join(", "));
