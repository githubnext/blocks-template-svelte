import fs from "fs";
import { searchForWorkspaceRoot } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import preprocess from "svelte-preprocess";
import basicSsl from "@vitejs/plugin-basic-ssl";
import parseGitConfig from "parse-git-config";

function sendJson(res, json) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(json));
}

// https://vitejs.dev/config/
const getViteConfigDev = (port, https) => ({
  root: "src",
  server: {
    port,
    strictPort: true,
    https,
    hmr: {
      host: "localhost",
    },
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd())],
    },
  },
  build: {
    commonjsOptions: {
      include: /node_modules/,
    },
  },
  plugins: [
    https ? basicSsl() : null,
    svelte({
      preprocess: preprocess({}),
    }),
    {
      name: "configure-response-headers",
      configureServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Access-Control-Allow-Private-Network", "true");
          next();
        });
      },
    },
    {
      name: "dev-server-endpoints",
      configureServer: (server) => {
        server.middlewares.use("/blocks.config.json", (req, res) => {
          const json = fs.readFileSync("./blocks.config.json");
          sendJson(res, JSON.parse(json));
        });

        server.middlewares.use("/git.config.json", (req, res) => {
          sendJson(res, parseGitConfig.sync());
        });
      },
    },
  ],
});

export default getViteConfigDev;
