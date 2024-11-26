import fs from "fs";
import path from "path";
import { BotClient } from "../class/client";
import chalk from "chalk";

export const loadEvents = (client: BotClient) => {
  const eventDirs = fs.readdirSync(`${__dirname}/../events`);

  for (const dir of eventDirs) {
    const eventFiles = fs
      .readdirSync(path.join(__dirname, "../events", dir))
      .filter((file) => file.endsWith(".ts"));

    for (const file of eventFiles) {
      const event = require(`../events/${dir}/${file}`);
      client.on(event.default.name, (...args) =>
        event.default.execute(...args, client)
      );
      console.log(chalk.cyan("[E]") + ` Event chargé : ${event.default.name}`);
    }
  }
};