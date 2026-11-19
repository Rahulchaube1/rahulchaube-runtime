/**
 * ANSI color + style helpers for the RahulChaube Runtime CLI.
 * Dependency-free so the CLI works on any Node or Bun runtime.
 */

const enabled =
  !process.env.NO_COLOR &&
  (process.env.FORCE_COLOR === "1" || (!!process.stdout.isTTY && process.env.TERM !== "dumb"));

function code(open: number, close: number) {
  const o = `\x1b[${open}m`;
  const c = `\x1b[${close}m`;
  return (s: string) => (enabled ? `${o}${s}${c}` : s);
}

export const reset = (s: string) => (enabled ? `\x1b[0m${s}\x1b[0m` : s);

export const bold = code(1, 22);
export const dim = code(2, 22);
export const italic = code(3, 23);
export const underline = code(4, 24);
export const strikethrough = code(9, 29);

export const black = code(30, 39);
export const red = code(31, 39);
export const green = code(32, 39);
export const yellow = code(33, 39);
export const blue = code(34, 39);
export const magenta = code(35, 39);
export const cyan = code(36, 39);
export const white = code(37, 39);
export const gray = code(90, 39);

export const bgBlack = code(40, 49);
export const bgRed = code(41, 49);
export const bgGreen = code(42, 49);
export const bgYellow = code(43, 49);
export const bgBlue = code(44, 49);
export const bgMagenta = code(45, 49);
export const bgCyan = code(46, 49);

export function rgb(r: number, g: number, b: number) {
  return (s: string) =>
    enabled ? `\x1b[38;2;${r};${g};${b}m${s}\x1b[0m` : s;
}

export function brand(s: string) {
  return bold(magenta(s));
}

export function link(s: string) {
  return underline(cyan(s));
}

export const colors = {
  enabled,
  reset,
  bold,
  dim,
  italic,
  underline,
  strikethrough,
  black,
  red,
  green,
  yellow,
  blue,
  magenta,
  cyan,
  white,
  gray,
  bgBlack,
  bgRed,
  bgGreen,
  bgYellow,
  bgBlue,
  bgMagenta,
  bgCyan,
  rgb,
  brand,
  link,
};
