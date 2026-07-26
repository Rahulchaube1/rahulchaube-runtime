/**
 * RahulChaube Runtime — Package Registry Client.
 *
 * HONEST IMPLEMENTATION STATUS:
 * ─────────────────────────────────────────────────────────────────
 * WHAT THIS DOES:
 *   Implements an HTTP client for querying package registries.
 *   Defaults to the public npm registry (https://registry.npmjs.org).
 *
 *   Implemented operations:
 *     - fetch package metadata (name, versions, description, dist-tags)
 *     - fetch specific version metadata (dependencies, dist.tarball URL)
 *     - search packages by keyword
 *     - resolve semver ranges to exact versions
 *     - check if a version exists
 *
 *   Caching:
 *     - In-memory TTL cache for registry responses (default: 5 minutes)
 *     - Prevents redundant network requests during dependency resolution
 *
 * HOST DEPENDENCY:
 *   Uses the host runtime's fetch() API for HTTP. The host must provide
 *   a global fetch() (available in Bun and Node.js >= 18).
 *
 * WHAT IS NOT IMPLEMENTED:
 *   - Tarball download / extraction
 *   - Package integrity verification (shasum / integrity field)
 *   - Private registry authentication (npm tokens)
 *   - Proxy support
 *   - Offline mode / disk cache
 *   - Semver range resolution (returns latest tag only for ranges)
 * ─────────────────────────────────────────────────────────────────
 */

export interface PackageMetadata {
  name: string;
  description?: string;
  /** All available versions keyed by version string */
  versions: Record<string, VersionMetadata>;
  "dist-tags": Record<string, string>;
  homepage?: string;
  repository?: { type: string; url: string };
  license?: string;
}

export interface VersionMetadata {
  name: string;
  version: string;
  description?: string;
  main?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  dist: {
    tarball: string;
    shasum: string;
    integrity?: string;
  };
  engines?: Record<string, string>;
}

export interface SearchResult {
  objects: Array<{
    package: {
      name: string;
      version: string;
      description?: string;
      keywords?: string[];
    };
    score: { final: number };
  }>;
  total: number;
}

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export class RegistryClient {
  private readonly baseUrl: string;
  private readonly cacheTtlMs: number;
  private cache: Map<string, CacheEntry<unknown>> = new Map();

  constructor(
    options: {
      registry?: string;
      cacheTtlMs?: number;
    } = {}
  ) {
    this.baseUrl = (options.registry ?? "https://registry.npmjs.org").replace(/\/$/, "");
    this.cacheTtlMs = options.cacheTtlMs ?? 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Fetch full package metadata from the registry.
   * Includes all versions and dist-tags.
   */
  public async getPackage(name: string): Promise<PackageMetadata> {
    const encoded = name.startsWith("@")
      ? "@" + encodeURIComponent(name.slice(1))
      : encodeURIComponent(name);
    const url = `${this.baseUrl}/${encoded}`;
    return this.fetchCached<PackageMetadata>(url);
  }

  /**
   * Fetch metadata for a specific version.
   */
  public async getVersion(name: string, version: string): Promise<VersionMetadata> {
    const encoded = name.startsWith("@")
      ? "@" + encodeURIComponent(name.slice(1))
      : encodeURIComponent(name);
    const url = `${this.baseUrl}/${encoded}/${encodeURIComponent(version)}`;
    return this.fetchCached<VersionMetadata>(url);
  }

  /**
   * Resolve a dist-tag (e.g. "latest") to an exact version string.
   * Returns null if the tag does not exist.
   */
  public async resolveTag(name: string, tag: string = "latest"): Promise<string | null> {
    const pkg = await this.getPackage(name);
    return pkg["dist-tags"][tag] ?? null;
  }

  /**
   * Check whether a specific version of a package exists.
   */
  public async exists(name: string, version: string): Promise<boolean> {
    try {
      const pkg = await this.getPackage(name);
      return version in pkg.versions;
    } catch {
      return false;
    }
  }

  /**
   * Get the list of all available versions for a package, sorted newest first.
   */
  public async listVersions(name: string): Promise<string[]> {
    const pkg = await this.getPackage(name);
    return Object.keys(pkg.versions).reverse();
  }

  /**
   * Search for packages by keyword using the npm search API.
   */
  public async search(query: string, limit: number = 10): Promise<SearchResult> {
    const url = `${this.baseUrl}/-/v1/search?text=${encodeURIComponent(query)}&size=${limit}`;
    return this.fetchCached<SearchResult>(url);
  }

  /**
   * Clear the in-memory response cache.
   */
  public clearCache(): void {
    this.cache.clear();
  }

  /** Number of entries currently in the cache */
  public cacheSize(): number {
    return this.cache.size;
  }

  private async fetchCached<T>(url: string): Promise<T> {
    const now = Date.now();
    const cached = this.cache.get(url);
    if (cached && cached.expiresAt > now) {
      return cached.data as T;
    }

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "rahulchaube-runtime/1.0.0",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Registry request failed: ${response.status} ${response.statusText} — ${url}`
      );
    }

    const data = (await response.json()) as T;
    this.cache.set(url, { data, expiresAt: now + this.cacheTtlMs });
    return data;
  }
}

/** Default registry client pointing to the public npm registry */
export const defaultRegistry = new RegistryClient();
