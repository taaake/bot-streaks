import { Duo } from "../../db/models/Duo";

export default {
  name: "duo",
  description: "Affiche votre duo actuel.",
  execute: async (interaction: any, client: any) => {
    try {
      const userId = interaction.member.id;
      const botUser = client.user;
      const botAvatar = botUser.dynamicAvatarURL("png", 1024);
      const duo = await Duo.findOne({ where: { userId } });
      if (!duo) {
        const embedNoDuo = {
          description:
            "Vous n'êtes actuellement pas en duo. Pour créer un duo, veuillez utiliser `/askduo`",
          color: 0xfc8917,
          thumbnail: {
            url: botAvatar,
          },
          footer: {
            text: botUser.username,
            icon_url: botAvatar,
          },
          timestamp: new Date().toISOString(),
        };

        return interaction.createMessage({
          embeds: [embedNoDuo],
          flags: 64,
        });
      }

      const duoPartnerId = duo.partnerId;
      const duoPartner = client.users.get(duoPartnerId);

      const embedWithDuo = {
        description: `Vous êtes actuellement en duo avec \`${duoPartner?.username}\` (\`${duoPartnerId}\`)`,
        color: 0xfc8917,
        thumbnail: {
          url: botAvatar,
        },
        footer: {
          text: botUser.username,
          icon_url: botAvatar,
        },
        timestamp: new Date().toISOString(),
      };

      return interaction.createMessage({
        embeds: [embedWithDuo],
        flags: 64,
      });
    } catch (err) {
      console.error(err);
      await interaction.createMessage({
        content: "Erreur de commande ❌",
        flags: 64,
      });
    }
  },
};