/**
 * RahulChaube Runtime — Virtual Filesystem Layer.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

export class VirtualFS {
  private memCache: Map<string, string> = new Map();

  public readFile(path: string): string {
    if (this.memCache.has(path)) {
      return this.memCache.get(path)!;
    }
    const content = readFileSync(path, "utf-8");
    this.memCache.set(path, content);
    return content;
  }

  public writeFile(path: string, content: string): void {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content, "utf-8");
    this.memCache.set(path, content);
  }

  public exists(path: string): boolean {
    return this.memCache.has(path) || existsSync(path);
  }
}
