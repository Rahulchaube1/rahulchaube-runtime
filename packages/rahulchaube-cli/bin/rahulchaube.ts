#!/usr/bin/env -S bun run
/**
 * RahulChaube Runtime — CLI entrypoint.
 *
 * This is an independently-branded, MIT-compatible fork of the Bun project.
 * It is NOT the official Bun and is not endorsed by the Bun authors.
 */
import { main } from "../src/index.ts";

const code = await main(process.argv.slice(2));
if (code !== 0) process.exitCode = code;
