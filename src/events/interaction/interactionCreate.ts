import chalk from "chalk";

export default {
  name: "interactionCreate",
  execute: async (interaction: any, client: any) => {
    if (interaction.type === 2) {
      const command = client.commands.get(interaction.data.name);
      if (!command) return;

      try {
        console.log(
          chalk.blue("[I]") + ` Commande utilisée : ${interaction.data.name}`
        );
        await command.execute(interaction, client);
      } catch (err) {
        console.error(
          chalk.red("[Erreur]") +
            ` Problème avec la commande ${interaction.data.name}:`,
          err
        );
        await interaction.createMessage({
          content: "Erreur de commande ❌",
          flags: 64,
        });
      }
    }
  },
};