import chalk from "chalk";
import { createServer } from "vite";
import getViteConfigDev from "./config/vite.config.dev.mjs";
import minimist from "minimist";

const argv = minimist(process.argv.slice(2));

process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";

const main = async () => {
  const port = argv.port || process.env.PORT || 4000;
  const https = Boolean(argv.https || process.env.HTTPS);
  const devServer = await createServer(getViteConfigDev(port, https));

  console.log(
    chalk.cyan(
      `Starting the development server at http${
        https ? "s" : ""
      }://localhost:${port}`
    )
  );
  await devServer.listen();

  if (process.env.CI !== "true") {
    // Gracefully exit when stdin ends
    process.stdin.on("end", function () {
      devServer.close();
      process.exit();
    });
  }
};
main();
