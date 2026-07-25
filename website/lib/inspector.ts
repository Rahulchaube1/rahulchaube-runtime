/**
 * Runtime Inspector & Memory Profiler Infrastructure for RahulChaube Runtime.
 * Provides programmatic access to system metrics, V8 heap usage, and startup diagnostics.
 */

export interface SystemMetrics {
  platform: string;
  arch: string;
  nodeVersion: string;
  bunVersion?: string;
  uptimeSeconds: number;
  memoryUsage: {
    rssMb: number;
    heapTotalMb: number;
    heapUsedMb: number;
    externalMb: number;
  };
}

export function getSystemMetrics(): SystemMetrics {
  const mem = process.memoryUsage();
  return {
    platform: process.platform,
    arch: process.arch,
    nodeVersion: process.version,
    bunVersion: (globalThis as any).Bun?.version,
    uptimeSeconds: Math.floor(process.uptime()),
    memoryUsage: {
      rssMb: Math.round((mem.rss / 1024 / 1024) * 100) / 100,
      heapTotalMb: Math.round((mem.heapTotal / 1024 / 1024) * 100) / 100,
      heapUsedMb: Math.round((mem.heapUsed / 1024 / 1024) * 100) / 100,
      externalMb: Math.round((mem.external / 1024 / 1024) * 100) / 100,
    },
  };
}
