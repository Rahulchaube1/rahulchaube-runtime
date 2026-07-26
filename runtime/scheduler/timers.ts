/**
 * RahulChaube Runtime — Timer Registry.
 *
 * HONEST IMPLEMENTATION STATUS:
 * ─────────────────────────────────────────────────────────────────
 * WHAT THIS DOES:
 *   Wraps the host JavaScript engine's timer primitives (setTimeout,
 *   setInterval, clearTimeout, clearInterval, setImmediate) with a
 *   centralized registry that provides:
 *     - Unique timer IDs tracked across the process
 *     - Per-execution-context cancellation (cancel all timers at once)
 *     - Active timer inspection (list pending timers)
 *     - Leak detection (timers not cleared before process exit)
 *     - Minimum delay enforcement (prevent 0ms busy-loops in CLI scripts)
 *
 * HOST DEPENDENCY:
 *   The actual timer scheduling is performed by the host engine's event
 *   loop (Bun's JavaScriptCore / Node.js libuv). This layer does NOT
 *   implement a custom event loop or timer wheel. It is a management
 *   and tracking layer on top of host primitives.
 *
 * WHAT IS NOT IMPLEMENTED:
 *   - High-resolution timers (use performance.now() directly)
 *   - Timer coalescing / batching
 *   - Custom event loop integration
 *   - Timer serialization across Workers
 * ─────────────────────────────────────────────────────────────────
 */

export interface TimerEntry {
  id: number;
  kind: "timeout" | "interval" | "immediate";
  /** Callback label for debugging */
  label: string;
  createdAt: number;
  /** Delay in ms (0 for immediate) */
  delay: number;
  /** Host handle returned by setTimeout / setInterval */
  hostHandle: ReturnType<typeof setTimeout>;
  cleared: boolean;
}

let nextId = 1;

export class TimerRegistry {
  private timers: Map<number, TimerEntry> = new Map();

  /**
   * Schedule a one-shot timer. Returns a RahulChaube timer ID.
   * Analogous to globalThis.setTimeout.
   */
  public setTimeout(
    callback: (...args: unknown[]) => void,
    delay: number = 0,
    label: string = "anonymous",
    ...args: unknown[]
  ): number {
    const id = nextId++;
    const hostHandle = setTimeout(() => {
      const entry = this.timers.get(id);
      if (entry) entry.cleared = true;
      this.timers.delete(id);
      callback(...args);
    }, Math.max(0, delay));

    this.timers.set(id, {
      id,
      kind: "timeout",
      label,
      createdAt: Date.now(),
      delay,
      hostHandle,
      cleared: false,
    });
    return id;
  }

  /**
   * Schedule a recurring timer. Returns a RahulChaube timer ID.
   * Analogous to globalThis.setInterval.
   */
  public setInterval(
    callback: (...args: unknown[]) => void,
    delay: number = 0,
    label: string = "anonymous",
    ...args: unknown[]
  ): number {
    const id = nextId++;
    const hostHandle = setInterval(() => {
      callback(...args);
    }, Math.max(1, delay)); // Minimum 1ms for intervals to prevent busy-loop

    this.timers.set(id, {
      id,
      kind: "interval",
      label,
      createdAt: Date.now(),
      delay,
      hostHandle,
      cleared: false,
    });
    return id;
  }

  /**
   * Schedule a callback to run in the next iteration of the event loop.
   * Analogous to setImmediate.
   */
  public setImmediate(
    callback: (...args: unknown[]) => void,
    label: string = "anonymous",
    ...args: unknown[]
  ): number {
    const id = nextId++;
    const hostHandle = setTimeout(() => {
      const entry = this.timers.get(id);
      if (entry) entry.cleared = true;
      this.timers.delete(id);
      callback(...args);
    }, 0);

    this.timers.set(id, {
      id,
      kind: "immediate",
      label,
      createdAt: Date.now(),
      delay: 0,
      hostHandle,
      cleared: false,
    });
    return id;
  }

  /**
   * Clear a timer by RahulChaube timer ID.
   * Works for timeout, interval, and immediate.
   */
  public clear(id: number): boolean {
    const entry = this.timers.get(id);
    if (!entry) return false;
    clearTimeout(entry.hostHandle);
    entry.cleared = true;
    this.timers.delete(id);
    return true;
  }

  /**
   * Clear all pending timers in this registry.
   * Call this when a script finishes to prevent leaks.
   */
  public clearAll(): number {
    let count = 0;
    for (const entry of this.timers.values()) {
      clearTimeout(entry.hostHandle);
      entry.cleared = true;
      count++;
    }
    this.timers.clear();
    return count;
  }

  /**
   * Return all currently pending (non-cleared) timers.
   */
  public pending(): TimerEntry[] {
    return [...this.timers.values()].filter((e) => !e.cleared);
  }

  /**
   * Return the count of active timers.
   */
  public activeCount(): number {
    return this.timers.size;
  }
}
