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
    const stdin = {
      resolveDir: process.cwd(),
      contents: `
    import Component from "./${block.entry}";

    const root = document.getElementById("root");
    let component;

    export default (props) => {
      if (component) {
        component.$set(props);
      } else {
        component = new Component({ target: root, props });
      }
    };
    `,
    };

    return esbuild.build({
      stdin,
      bundle: true,
      outfile: `dist/${block.id}/index.js`,
      format: "iife",
      plugins: [sveltePlugin({ preprocess: sveltePreprocess({}) })],
      globalName: "VanillaBlockBundle",
      external: ["@githubnext/blocks"],
      minify: true,
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
