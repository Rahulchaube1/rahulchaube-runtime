/**
 * RahulChaube Runtime — Worker Threads Subsystem.
 *
 * HONEST IMPLEMENTATION STATUS:
 * ─────────────────────────────────────────────────────────────────
 * WHAT THIS DOES:
 *   Implements the RahulChaube Worker API for multi-threaded execution.
 *   - Supports `new RahulChaubeWorker(scriptPath, options)`
 *   - Automatically compiles TypeScript worker scripts on-the-fly before launching worker threads
 *   - Implements bidirectional `postMessage()` and `onmessage` / `on('message')` / `addEventListener('message')`
 *   - Implements `terminate()`, `onerror`, `onexit` lifecycle hooks
 *   - Implements structured cloning serialization fallback for complex messages
 *
 * HOST DEPENDENCY:
 *   Wraps Node.js `node:worker_threads` Worker primitive.
 *   TypeScript transpilation is performed natively by RahulChaube Transpiler.
 * ─────────────────────────────────────────────────────────────────
 */

import { Worker as NodeWorker } from "node:worker_threads";
import { readFileSync, existsSync } from "node:fs";
import { resolve, extname } from "node:path";
import { EventEmitter } from "node:events";
import { transpileSource } from "../compiler/transpiler.ts";

export interface WorkerOptions {
  workerData?: unknown;
  env?: Record<string, string>;
  name?: string;
}

export type MessageHandler = (message: unknown) => void;
export type ErrorHandler = (error: Error) => void;
export type ExitHandler = (code: number) => void;

export class RahulChaubeWorker extends EventEmitter {
  private innerWorker: NodeWorker | null = null;
  public onmessage: MessageHandler | null = null;
  public onerror: ErrorHandler | null = null;
  public onexit: ExitHandler | null = null;
  private isTerminated = false;

  constructor(scriptPath: string, options: WorkerOptions = {}) {
    super();
    const absPath = resolve(process.cwd(), scriptPath);

    if (!existsSync(absPath)) {
      throw new Error(`Worker script not found: ${absPath}`);
    }

    const ext = extname(absPath);
    const rawSource = readFileSync(absPath, "utf-8");

    // Transpile TypeScript if necessary
    let codeToRun = rawSource;
    if (ext === ".ts" || ext === ".tsx" || ext === ".mts" || ext === ".cts") {
      const transpiled = transpileSource({ fileName: absPath, sourceText: rawSource });
      codeToRun = transpiled.code;
    }

    // Wrap worker code to provide worker scope globals (postMessage, parentPort)
    const workerWrapperCode = `
      const { parentPort, workerData } = require('node:worker_threads');
      const globalSelf = typeof globalThis !== 'undefined' ? globalThis : self;

      globalSelf.workerData = workerData;
      globalSelf.postMessage = (msg) => {
        if (parentPort) parentPort.postMessage(msg);
      };

      if (parentPort) {
        parentPort.on('message', (msg) => {
          if (typeof globalSelf.onmessage === 'function') {
            globalSelf.onmessage({ data: msg });
          }
        });
      }

      ${codeToRun}
    `;

    this.innerWorker = new NodeWorker(workerWrapperCode, {
      eval: true,
      workerData: options.workerData,
      env: options.env,
      name: options.name,
    });

    this.setupListeners();
  }

  private setupListeners(): void {
    if (!this.innerWorker) return;

    this.innerWorker.on("message", (msg: unknown) => {
      if (this.isTerminated) return;
      const eventData = { data: this.cloneStructured(msg) };
      this.emit("message", eventData);
      if (typeof this.onmessage === "function") {
        this.onmessage(eventData);
      }
    });

    this.innerWorker.on("error", (err: Error) => {
      if (this.isTerminated) return;
      this.emit("error", err);
      if (typeof this.onerror === "function") {
        this.onerror(err);
      }
    });

    this.innerWorker.on("exit", (code: number) => {
      this.isTerminated = true;
      this.emit("exit", code);
      if (typeof this.onexit === "function") {
        this.onexit(code);
      }
    });
  }

  public postMessage(message: unknown): void {
    if (this.isTerminated || !this.innerWorker) {
      throw new Error("Cannot call postMessage on terminated worker");
    }
    const cloned = this.cloneStructured(message);
    this.innerWorker.postMessage(cloned);
  }

  public async terminate(): Promise<number> {
    if (this.isTerminated || !this.innerWorker) return 0;
    this.isTerminated = true;
    const exitCode = await this.innerWorker.terminate();
    this.innerWorker = null;
    return exitCode;
  }

  public addEventListener(event: string, handler: MessageHandler | ErrorHandler | ExitHandler): void {
    this.on(event, handler as (...args: unknown[]) => void);
  }

  public removeEventListener(event: string, handler: MessageHandler | ErrorHandler | ExitHandler): void {
    this.off(event, handler as (...args: unknown[]) => void);
  }

  /** Structured Clone algorithm helper (JSON fallback for cross-context safety) */
  private cloneStructured<T>(val: T): T {
    if (val === null || typeof val !== "object") return val;
    try {
      if (typeof structuredClone === "function") {
        return structuredClone(val);
      }
      return JSON.parse(JSON.stringify(val));
    } catch {
      return val;
    }
  }
}
