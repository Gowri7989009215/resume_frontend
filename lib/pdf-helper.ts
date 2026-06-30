/**
 * pdf-parse v1.x helper – bypasses Turbopack / Next.js ESM bundling.
 *
 * Turbopack intercepts every `import`, `require`, and even `createRequire`,
 * replacing the CJS-only pdf-parse with its own bundled version that
 * breaks the default-export. Using `eval("require")` is the standard
 * escape-hatch to force Node's native CJS loader at runtime.
 */

const nativeRequire = eval("require") as NodeJS.Require;

// pdf-parse v1.x: module.exports = function(dataBuffer, options) { ... }
const pdfParse: (buf: Buffer) => Promise<{ text: string }> = nativeRequire("pdf-parse");

export { pdfParse };
