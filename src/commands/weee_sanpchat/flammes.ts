import { Duo } from "../../db/models/Duo";
import { Flames } from "../../db/models/Flammes";

export default {
  name: "flammes",
  description: "Affiche votre nombre de flammes actuel avec votre duo",
  execute: async (interaction: any, client: any) => {
    try {
      const userId = interaction.member.id;
      const botUser = client.user;
      const botAvatar = botUser.dynamicAvatarURL("png", 1024);
      const duo = await Duo.findOne({ where: { userId } });
      if (!duo) {
        return interaction.createMessage({
          embeds: [
            {
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
            },
          ],
        });
      }

      const duoPartnerId = duo.partnerId;
      const flamesRecord = await Flames.findOne({
        where: { userId, partnerId: duoPartnerId },
      });
      const flames = flamesRecord?.count || 0;

      return interaction.createMessage({
        embeds: [
          {
            description: `Vous avez actuellement **${flames} 🔥** avec <@${duoPartnerId}>`,
            color: 0xfc8917,
            thumbnail: {
              url: botAvatar,
            },
            footer: {
              text: botUser.username,
              icon_url: botAvatar,
            },
            timestamp: new Date().toISOString(),
          },
        ],
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