/**
 * RahulChaube Runtime — Microtask Queue.
 *
 * HONEST IMPLEMENTATION STATUS:
 * ─────────────────────────────────────────────────────────────────
 * WHAT THIS DOES:
 *   Implements a userland microtask queue that runs callbacks in FIFO
 *   order, draining fully before returning. This mirrors the semantics
 *   of Promise resolution microtasks in the ECMAScript specification.
 *
 *   Key properties:
 *     - FIFO ordering guaranteed
 *     - Microtasks enqueued during drain are processed in the same drain
 *       cycle (recursive microtask semantics per spec §8.6)
 *     - Maximum recursion depth guard prevents infinite microtask loops
 *     - Integration with host queueMicrotask() for cross-task scheduling
 *
 * HOST DEPENDENCY:
 *   `queueMicrotask()` is a host primitive. When drainNative() is called,
 *   the host engine schedules the drain at the end of the current task.
 *   The queue data structure and FIFO ordering are implemented natively.
 *
 * WHAT IS NOT IMPLEMENTED:
 *   - Priority lanes (all microtasks have equal priority)
 *   - Cross-Worker microtask propagation
 *   - Cancellation of already-enqueued microtasks
 * ─────────────────────────────────────────────────────────────────
 */

export type MicrotaskCallback = () => void | Promise<void>;

const MAX_DRAIN_DEPTH = 10_000;

export class MicrotaskQueue {
  private queue: MicrotaskCallback[] = [];
  private draining = false;
  private totalEnqueued = 0;
  private totalDrained = 0;

  /**
   * Enqueue a microtask. Will be executed before any macrotask.
   * If a drain is in progress, the task is appended and will
   * be processed in the current drain cycle.
   */
  public enqueue(task: MicrotaskCallback): void {
    this.queue.push(task);
    this.totalEnqueued++;
  }

  /**
   * Drain the queue synchronously. Processes all tasks currently
   * in the queue plus any tasks enqueued during processing.
   *
   * Returns the number of tasks processed.
   * Throws if MAX_DRAIN_DEPTH is exceeded (prevents infinite loops).
   */
  public drain(): number {
    if (this.draining) return 0; // Re-entrant drain guard
    this.draining = true;
    let processed = 0;

    try {
      while (this.queue.length > 0) {
        if (processed >= MAX_DRAIN_DEPTH) {
          throw new Error(
            `MicrotaskQueue: maximum drain depth (${MAX_DRAIN_DEPTH}) exceeded. ` +
            `Possible infinite microtask loop.`
          );
        }
        const task = this.queue.shift()!;
        try {
          const result = task();
          // If the task returns a Promise, we cannot await it synchronously
          // here — it will be handled by the host's Promise resolution.
          // This is a known limitation of synchronous drain mode.
          if (result instanceof Promise) {
            result.catch((err) => {
              console.error("[MicrotaskQueue] Unhandled rejection in microtask:", err);
            });
          }
        } catch (err) {
          console.error("[MicrotaskQueue] Uncaught error in microtask:", err);
        }
        processed++;
        this.totalDrained++;
      }
    } finally {
      this.draining = false;
    }

    return processed;
  }

  /**
   * Schedule a drain via the host's queueMicrotask().
   * The drain will execute after the current synchronous code completes
   * but before the next macrotask.
   */
  public drainNative(): void {
    queueMicrotask(() => this.drain());
  }

  /** Number of tasks waiting in the queue */
  public size(): number {
    return this.queue.length;
  }

  /** Whether a drain is currently in progress */
  public isDraining(): boolean {
    return this.draining;
  }

  /** Diagnostic statistics */
  public stats(): { enqueued: number; drained: number; pending: number } {
    return {
      enqueued: this.totalEnqueued,
      drained: this.totalDrained,
      pending: this.queue.length,
    };
  }

  /** Clear all pending tasks without executing them */
  public clear(): void {
    this.queue.length = 0;
  }
}
