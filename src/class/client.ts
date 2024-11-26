import { Client } from "eris";
import chalk from "chalk";
import { loadCommands } from "../utils/commandHandler";
import { loadEvents } from "../utils/eventHandler";
import { registerSlashCommands } from "../utils/SlashCommands";
import { connectDatabase } from "../db/index";
import { Duo } from "../db/models/Duo";
import { Flames } from "../db/models/Flammes";

export class BotClient extends Client {
  commands: Map<string, any>;

  constructor(token: string) {
    super(token);
    this.commands = new Map();
    console.log(chalk.green("[C]") + " Client initialisé");
  }

  async initialize() {
    try {
      await connectDatabase();
      await Duo.sync();
      await Flames.sync();
      loadCommands(this);
      loadEvents(this);
      this.on("ready", async () => {
        await registerSlashCommands(this);
      });

      this.connect();
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }

  loadCommand(name: string, command: any) {
    this.commands.set(name, command);
    console.log(chalk.green("[C]") + ` Commande chargée : ${name}`);
  }
}