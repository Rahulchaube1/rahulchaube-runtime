declare module "rc:web" {
  export interface Request {
    method: string;
    path: string;
    body: string;
    headers: Record<string, string[]>;
    query: Record<string, string[]>;
    params: Record<string, string>;
  }
  export interface Reply { status: number; headers?: Record<string, string>; body: string }
  export interface Server { port: number; close(): void }
  export type Handler = (request: Request) => Reply | Promise<Reply>;
  export interface App {
    on(method: string, path: string, handler: Handler): App;
    get(path: string, handler: Handler): App;
    post(path: string, handler: Handler): App;
    handle(request: Pick<Request, "method" | "path"> & Partial<Request>): Promise<Reply>;
    listen(options?: { hostname?: string; port?: number }): Server;
  }
  export function createApp(): App;
  export function json(value: unknown, status?: number): Reply;
  export function text(body: unknown, status?: number): Reply;
}

declare module "rc:fs" {
  export function readText(path: string): string;
  export function writeText(path: string, text: string): void;
  export function readJSON<T = unknown>(path: string): T;
  export function writeJSON(path: string, value: unknown): void;
}

declare module "rc:test" {
  export function test(name: string, fn: () => unknown): void;
  export function equal(actual: unknown, expected: unknown): void;
  export function assert(value: unknown, message?: string): asserts value;
  export function runTests(): Promise<void>;
}

declare const RC: {
  readonly version: string;
  readonly args: readonly string[];
  readText: typeof import("rc:fs").readText;
  writeText: typeof import("rc:fs").writeText;
  listen(hostname: string, port: number, handler: import("rc:web").Handler): import("rc:web").Server;
};
declare const console: Record<"log" | "info" | "warn" | "error", (...args: unknown[]) => void>;
declare function setTimeout(fn: () => void, delay: number): number;
declare function clearTimeout(id: number): void;
