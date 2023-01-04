import * as fs from "fs";
import chalk from "chalk";
import express from "express";
import { createServer } from "vite";
import getViteConfigDev from "./config/vite.config.dev.mjs";
import parseGitConfig from "parse-git-config";
import minimist from "minimist";

const argv = minimist(process.argv.slice(2));

process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";

const main = async () => {
  const port = argv.port || process.env.PORT || 4000;
  const app = express();

  const vite = await createServer(getViteConfigDev(port));

  app.get("/blocks.config.json", (req, res) => {
    const json = fs.readFileSync("./blocks.config.json");
    const obj = JSON.parse(json);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(obj);
  });

  app.get("/git.config.json", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(parseGitConfig.sync());
  });

  app.use(vite.middlewares);

  console.log(
    chalk.cyan(`Starting the development server at http://localhost:${port}`)
  );
  app.listen(port);

  if (process.env.CI !== "true") {
    // Gracefully exit when stdin ends
    process.stdin.on("end", function () {
      app.close();
      process.exit();
    });
  }
};
main();
