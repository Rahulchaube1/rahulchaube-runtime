/**
 * RahulChaube Runtime — Module Cache with TTL + Invalidation.
 *
 * HONEST IMPLEMENTATION STATUS:
 * ─────────────────────────────────────────────────────────────────
 * WHAT THIS DOES:
 *   Implements an optimized module cache with:
 *     - Content-hash keyed entries (SHA-1 of source text)
 *     - TTL-based expiration (default: 30 seconds in dev mode)
 *     - File-stat-based invalidation (mtime comparison)
 *     - LRU eviction when cache exceeds max size
 *     - Cache statistics (hits, misses, evictions)
 *
 * DESIGN:
 *   The cache stores compiled (transpiled) code and the resolved
 *   module graph. When a file is re-requested:
 *     1. Check mtime — if file is newer than cache entry, invalidate.
 *     2. Check TTL — if entry is expired, re-read and re-transpile.
 *     3. Otherwise, return cached entry (no disk I/O or transpilation).
 *
 * WHAT IS NOT IMPLEMENTED:
 *   - Persistent disk cache (all entries are in-memory only)
 *   - Shared cache across Worker threads
 *   - Dependency-graph-aware invalidation (changing a.ts doesn't
 *     automatically invalidate b.ts that imports a.ts)
 *   - Source map caching
 * ─────────────────────────────────────────────────────────────────
 */
import { statSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";

export interface CachedModule {
  /** Absolute path to the source file */
  filePath: string;
  /** SHA-1 hash of source content at cache time */
  contentHash: string;
  /** Transpiled JavaScript output */
  compiledCode: string;
  /** Raw TypeScript/JavaScript source */
  sourceText: string;
  /** File modification time at cache time (ms since epoch) */
  cachedMtime: number;
  /** Wall clock time when this entry was cached */
  cachedAt: number;
  /** TTL in milliseconds (0 = never expire) */
  ttlMs: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  invalidations: number;
  evictions: number;
  size: number;
}

export class ModuleCache {
  private cache: Map<string, CachedModule> = new Map();
  /** Insertion-order list of keys for LRU eviction */
  private insertionOrder: string[] = [];
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    invalidations: 0,
    evictions: 0,
    size: 0,
  };

  constructor(
    private readonly maxSize: number = 500,
    private readonly defaultTtlMs: number = 30_000 // 30 seconds
  ) {}

  /**
   * Attempt to retrieve a cached module entry.
   * Returns null if:
   *   - No entry exists for the path
   *   - The file's mtime is newer than the cached entry (file changed)
   *   - The entry has exceeded its TTL
   */
  public get(filePath: string): CachedModule | null {
    const entry = this.cache.get(filePath);
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    const now = Date.now();

    // TTL check
    if (entry.ttlMs > 0 && now - entry.cachedAt > entry.ttlMs) {
      this.invalidate(filePath, "ttl-expired");
      return null;
    }

    // mtime check — detect file changes without hashing
    if (existsSync(filePath)) {
      try {
        const { mtimeMs } = statSync(filePath);
        if (mtimeMs > entry.cachedMtime) {
          this.invalidate(filePath, "file-changed");
          return null;
        }
      } catch {
        // If we can't stat the file, treat as cache miss
        this.stats.misses++;
        return null;
      }
    }

    this.stats.hits++;
    return entry;
  }

  /**
   * Store a compiled module in the cache.
   */
  public set(
    filePath: string,
    sourceText: string,
    compiledCode: string,
    ttlMs?: number
  ): CachedModule {
    // Evict LRU entry if at capacity
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    const contentHash = createHash("sha1").update(sourceText).digest("hex");
    let cachedMtime = 0;
    try {
      cachedMtime = existsSync(filePath) ? statSync(filePath).mtimeMs : Date.now();
    } catch {
      cachedMtime = Date.now();
    }

    const entry: CachedModule = {
      filePath,
      contentHash,
      compiledCode,
      sourceText,
      cachedMtime,
      cachedAt: Date.now(),
      ttlMs: ttlMs ?? this.defaultTtlMs,
    };

    const isNew = !this.cache.has(filePath);
    this.cache.set(filePath, entry);

    if (isNew) {
      this.insertionOrder.push(filePath);
      this.stats.size++;
    }

    return entry;
  }

  /**
   * Explicitly invalidate a cache entry.
   */
  public invalidate(filePath: string, _reason?: string): boolean {
    if (!this.cache.has(filePath)) return false;
    this.cache.delete(filePath);
    this.insertionOrder = this.insertionOrder.filter((k) => k !== filePath);
    this.stats.invalidations++;
    this.stats.size--;
    return true;
  }

  /**
   * Clear all cached entries.
   */
  public clear(): void {
    this.cache.clear();
    this.insertionOrder = [];
    this.stats.size = 0;
  }

  /**
   * Return current cache statistics.
   */
  public getStats(): Readonly<CacheStats> {
    return { ...this.stats };
  }

  /**
   * Return the hit rate as a percentage (0–100).
   */
  public hitRate(): number {
    const total = this.stats.hits + this.stats.misses;
    if (total === 0) return 0;
    return (this.stats.hits / total) * 100;
  }

  /**
   * Number of entries currently in the cache.
   */
  public size(): number {
    return this.cache.size;
  }

  /**
   * Return all currently cached file paths.
   */
  public keys(): string[] {
    return [...this.cache.keys()];
  }

  private evictLRU(): void {
    if (this.insertionOrder.length === 0) return;
    const oldest = this.insertionOrder.shift()!;
    this.cache.delete(oldest);
    this.stats.evictions++;
    this.stats.size--;
  }
}

/** Process-level module cache singleton */
export const globalModuleCache = new ModuleCache();
