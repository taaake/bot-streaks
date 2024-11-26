import fs from "fs";
import path from "path";
import { BotClient } from "../class/client";
import chalk from "chalk";

export const loadCommands = (client: BotClient) => {
  const commandDirs = fs.readdirSync(`${__dirname}/../commands`);

  for (const dir of commandDirs) {
    const commandFiles = fs
      .readdirSync(path.join(__dirname, "../commands", dir))
      .filter((file) => file.endsWith(".ts"));

    for (const file of commandFiles) {
      const command = require(`../commands/${dir}/${file}`);
      client.loadCommand(command.default.name, command.default);
    }
  }

  console.log(chalk.yellow("[CH]") + " Les commandes sont chargées");
};