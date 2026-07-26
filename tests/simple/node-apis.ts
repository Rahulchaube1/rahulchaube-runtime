import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";

const cwd = process.cwd();
const normalized = path.normalize(cwd);
const hash = crypto.createHash("sha256").update("rahulchaube").digest("hex");

console.log("Platform:", os.platform());
console.log("Normalized Path:", normalized);
console.log("SHA-256 Hash:", hash.substring(0, 16));
