import { dirname, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

const __dirname = dirname(fileURLToPath(import.meta.url));

const distDir = resolve(__dirname, "dist");
const appDistDir = resolve(__dirname, "dist-app");

type BuildTarget = "library" | "application";

export default defineConfig(({ command }) => {
  const isServe = command === "serve";
  const target: BuildTarget = isServe
    ? "application"
    : ((process.env.VITE_BUILD_TARGET as BuildTarget | undefined) ?? "library");

  const plugins: PluginOption[] = [react()];

  if (target === "library") {
    plugins.push(
      dts({
        tsconfigPath: "./tsconfig.app.json",
        entryRoot: resolve(__dirname, "src"),
        exclude: ["src/main.tsx"],
        insertTypesEntry: true,
        copyDtsFiles: true,
        beforeWriteFile: (filePath, content) => {
          const typesEntry = normalize(resolve(distDir, "index.d.ts"));
          if (
            normalize(filePath) === typesEntry &&
            !content.includes('reference path="./global.d.ts"')
          ) {
            return {
              content: `/// <reference path="./global.d.ts" />\n${content}`,
            };
          }
        },
      }),
    );
  }

  if (target === "application") {
    return {
      root: __dirname,
      plugins,
      build: {
        outDir: appDistDir,
        emptyOutDir: true,
        sourcemap: true,
      },
    };
  }

  return {
    plugins,
    build: {
      lib: {
        entry: resolve(__dirname, "src/index.ts"),
        formats: ["es"],
        fileName: "index",
      },
      rollupOptions: {
        external: ["react", "react-dom", "react/jsx-runtime"],
      },
      outDir: distDir,
      emptyOutDir: true,
      sourcemap: true,
      cssCodeSplit: false,
    },
  };
});
