import fetch from "node-fetch";
import { config } from "../../config";
import chalk from "chalk";

export const registerSlashCommands = async (client: any) => {
  const commands = [...client.commands.values()].map((cmd: any) => ({
    name: cmd.name,
    description: cmd.description,
    options: cmd.options || [],
  }));

  try {
    const response = await fetch(
      `https://discord.com/api/v10/applications/${config.clientId}/guilds/${config.guildId}/commands`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bot ${config.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commands),
      }
    );

    if (!response.ok) {
      console.error(
        chalk.red("[X]") +
          " Problème avec l'enregistrement des commandes :",
        await response.text()
      );
    } else {
      console.log(
        chalk.green("[/]") +
          ` Commandes enregistrées : ${config.guildId}`
      );
    }
  } catch (err) {
    console.error(
      chalk.red("[X]") +
        " Erreur des commandes :",
      err
    );
  }
};