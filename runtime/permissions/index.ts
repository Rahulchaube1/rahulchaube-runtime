/**
 * RahulChaube Runtime — Permissions System.
 *
 * HONEST IMPLEMENTATION STATUS:
 * ─────────────────────────────────────────────────────────────────
 * WHAT THIS DOES:
 *   Implements a capability-based permission system that gates access to
 *   sensitive runtime operations. Permission checks are synchronous and
 *   applied at runtime API call sites.
 *
 *   Supported permission namespaces:
 *     - read       → filesystem read operations
 *     - write      → filesystem write operations
 *     - net        → outbound network connections (by hostname)
 *     - env        → environment variable access (by name)
 *     - run        → subprocess execution (by command)
 *     - ffi        → native library loading
 *
 *   Each permission can be:
 *     - "allow-all"  → unconditionally granted (wildcard)
 *     - "deny-all"   → unconditionally denied
 *     - PathSpec[]   → granted only for matching paths/hosts/names
 *
 * WHAT IS NOT IMPLEMENTED:
 *   - Interactive prompt on first access (like Deno's --allow-* flags)
 *   - Permission persistence across processes
 *   - Revocation of already-granted permissions
 *   - Fine-grained glob matching (uses startsWith / exact match only)
 *   - Integration with OS-level sandbox (seccomp, pledge, etc.)
 *
 * ENFORCEMENT:
 *   Currently advisory only — permission checks must be called explicitly
 *   at API call sites. The runtime does not yet intercept all syscalls.
 * ─────────────────────────────────────────────────────────────────
 */

export type PermissionNamespace = "read" | "write" | "net" | "env" | "run" | "ffi";
export type PermissionState = "granted" | "denied" | "prompt";

export interface PermissionDescriptor {
  name: PermissionNamespace;
  /** Path, hostname, or identifier scope for the permission */
  path?: string;
}

export interface PermissionPolicy {
  read: "allow-all" | "deny-all" | string[];
  write: "allow-all" | "deny-all" | string[];
  net: "allow-all" | "deny-all" | string[];
  env: "allow-all" | "deny-all" | string[];
  run: "allow-all" | "deny-all" | string[];
  ffi: "allow-all" | "deny-all";
}

export class PermissionDeniedError extends Error {
  constructor(
    public readonly descriptor: PermissionDescriptor,
    hint?: string
  ) {
    super(
      `PermissionDenied: Requires ${descriptor.name}` +
      (descriptor.path ? ` access to "${descriptor.path}"` : " permission") +
      (hint ? `. ${hint}` : "") +
      `\n  → Pass --allow-${descriptor.name} to grant this permission.`
    );
    this.name = "PermissionDeniedError";
  }
}

const DEFAULT_POLICY: PermissionPolicy = {
  // In development mode, allow-all by default. Production should be locked down.
  read: "allow-all",
  write: "allow-all",
  net: "allow-all",
  env: "allow-all",
  run: "deny-all",
  ffi: "deny-all",
};

export class PermissionManager {
  private policy: PermissionPolicy;
  private log: Array<{ at: number; descriptor: PermissionDescriptor; state: PermissionState }> = [];

  constructor(policy: Partial<PermissionPolicy> = {}) {
    this.policy = { ...DEFAULT_POLICY, ...policy };
  }

  /**
   * Check whether a permission is granted.
   * Returns the resolved PermissionState without throwing.
   */
  public query(descriptor: PermissionDescriptor): PermissionState {
    const state = this.resolve(descriptor);
    this.log.push({ at: Date.now(), descriptor, state });
    return state;
  }

  /**
   * Assert that a permission is granted.
   * Throws PermissionDeniedError if denied.
   */
  public assert(descriptor: PermissionDescriptor): void {
    const state = this.query(descriptor);
    if (state === "denied") {
      throw new PermissionDeniedError(descriptor);
    }
  }

  /**
   * Update the policy at runtime.
   * Call this before executing untrusted scripts.
   */
  public setPolicy(partial: Partial<PermissionPolicy>): void {
    this.policy = { ...this.policy, ...partial };
  }

  /**
   * Grant a specific path/host for a namespace.
   * Converts "deny-all" to a list, or appends to existing list.
   */
  public grant(ns: PermissionNamespace, path: string): void {
    const current = this.policy[ns];
    if (current === "allow-all") return; // Already fully granted
    if (current === "deny-all") {
      (this.policy as Record<string, unknown>)[ns] = [path];
    } else {
      (current as string[]).push(path);
    }
  }

  /**
   * Return the full audit log of permission checks.
   */
  public auditLog(): typeof this.log {
    return [...this.log];
  }

  private resolve(descriptor: PermissionDescriptor): PermissionState {
    const rule = this.policy[descriptor.name];

    if (rule === "allow-all") return "granted";
    if (rule === "deny-all") return "denied";

    // Array of allowed paths/hosts/names
    const target = descriptor.path ?? "";
    const allowed = rule as string[];

    for (const pattern of allowed) {
      // Exact match
      if (pattern === target) return "granted";
      // Prefix match (e.g. "/home/user" grants "/home/user/docs/file.txt")
      if (target.startsWith(pattern + "/") || target.startsWith(pattern + ":")) {
        return "granted";
      }
      // Glob * match (e.g. "*.example.com" matches "api.example.com")
      if (pattern.startsWith("*.")) {
        const domain = pattern.slice(2);
        if (target.endsWith("." + domain) || target === domain) return "granted";
      }
    }

    return "denied";
  }
}

/** Process-level default permission manager (allow-all for dev use) */
export const permissions = new PermissionManager();
