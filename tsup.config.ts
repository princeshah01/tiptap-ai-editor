import { defineConfig } from "tsup"
import { sassPlugin } from "esbuild-sass-plugin"
import path from "node:path"

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  format: ["esm", "cjs"],
  sourcemap: true,
  clean: true,
  minify: true,
  treeshake: true,
  splitting: false,
  dts: true,
  target: "es2022",
  platform: "browser",
  tsconfig: "./tsconfig.app.json",
  outExtension({ format }) {
    return { js: format === "esm" ? ".mjs" : ".cjs" }
  },
  esbuildOptions(options) {
    options.alias = {
      "@": path.resolve(__dirname, "src"),
    }
  },
  external: ["react", "react-dom"],
  esbuildPlugins: [sassPlugin({ type: "css" })],
})
