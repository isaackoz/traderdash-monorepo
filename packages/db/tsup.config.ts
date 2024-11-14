import { globSync } from "glob";
import { defineConfig } from "tsup";

const entries = globSync("src/**/*.ts", { posix: true });
console.log(entries);

export default defineConfig({
  entry: entries,
  outDir: "dist",
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  clean: true,
  sourcemap: true,
  treeshake: true,
  tsconfig: "tsconfig.json",
});
