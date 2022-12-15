const esbuild = require("esbuild");
const sveltePlugin = require("esbuild-svelte");
const sveltePreprocess = require("svelte-preprocess");
const path = require("path");

process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";

require("./config/env");

const build = async () => {
  const blocksConfigPath = path.resolve(process.cwd(), "blocks.config.json");
  const blocksConfig = require(blocksConfigPath);

  const blockBuildFuncs = blocksConfig.map((block) => {
    return esbuild.build({
      entryPoints: [`./` + block.entry],
      bundle: true,
      outdir: `dist/${block.id}`,
      format: "iife",
      plugins: [sveltePlugin({ preprocess: sveltePreprocess({}) })],
      globalName: "SvelteBlockBundle",
      minify: true,
      external: ["react", "react-dom"],
    });
  });

  try {
    await Promise.all(blockBuildFuncs);
  } catch (e) {
    console.error("Error bundling blocks", e);
  }
};
build();

module.exports = build;
