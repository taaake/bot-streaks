export default {
  name: "interactionCreate",
  execute: async (interaction: any, client: any) => {
    if (interaction.type === 3) {
      const customId = interaction.data.custom_id;
      const [action, type] = customId.split("_");

      if (type === "duo") {
        const askduo = client.commands.get("askduo");
        if (askduo?.handleButtonInteraction) {
          try {
            await askduo.handleButtonInteraction(interaction, client);
          } catch (err) {
            try {
              await interaction.createMessage({
                content: "Erreur d'interaction ❌",
                flags: 64,
              });
            } catch (responseErr) {
              console.error(responseErr);
            }
          }
        }
      }

      if (type === "leave") {
        const leaveduo = client.commands.get("leaveduo");
        if (leaveduo?.handleButtonInteraction) {
          try {
            await leaveduo.handleButtonInteraction(interaction, client);
          } catch (err) {
            try {
              await interaction.createMessage({
                content: "Erreur d'interaction ❌",
                flags: 64,
              });
            } catch (responseErr) {
              console.error(responseErr);
            }
          }
        }
      }
    }
  },
};