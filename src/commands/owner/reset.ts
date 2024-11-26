import { config } from "../../../config";
import { Flames } from "../../db/models/Flammes";
import { Duo } from "../../db/models/Duo";

export default {
  name: "reset",
  description: "Réinitialise les flammes",
  options: [
    {
      name: "flammes",
      description: "Réinitialise les flammes d'un membre et de son duo",
      type: 1,
      options: [
        {
          name: "membre",
          description: "Le membre que vous voulez reset ses flammes>",
          type: 6,
          required: true,
        },
      ],
    },
    {
      name: "db",
      description: "Réinitialise la base de données",
      type: 1,
    },
  ],
  execute: async (interaction: any, client: any) => {
    try {
      const subCommand = interaction.data.options[0]?.name;
      const userId = interaction.member?.id;

      if (!userId || !subCommand) {
        throw new Error("Interaction invalide : userId ou subCommand manquant");
      }

      if (!config.owners.includes(userId)) {
        return interaction.createMessage({
          embeds: [
            {
              title: "Erreur",
              description: "Vous n'êtes pas autorisé à utiliser cette commande ❌",
              color: 0xfc8917,
              timestamp: new Date().toISOString(),
            },
          ],
          flags: 64,
        });
      }

      if (subCommand === "flammes") {
        const memberId = interaction.data.options[0]?.value;

        const duo = await Duo.findOne({ where: { userId: memberId } });
        if (!duo) {
          return interaction.createMessage({
            embeds: [
              {
                title: "Erreur",
                description: "Ce membre n'a pas de duo",
                color: 0xfc8917,
                timestamp: new Date().toISOString(),
              },
            ],
          });
        }

        const duoPartnerId = duo.partnerId;

        await Flames.destroy({ where: { userId: memberId, partnerId: duoPartnerId } });
        await Flames.destroy({ where: { userId: duoPartnerId, partnerId: memberId } });

        return interaction.createMessage({
          embeds: [
            {
              title: "Réinitialisation",
              description: `Les flammes entre <@${memberId}> et <@${duoPartnerId}> ont été réinitialisées`,
              color: 0xfc8917,
              timestamp: new Date().toISOString(),
            },
          ],
        });
      } else if (subCommand === "db") {
        await Duo.destroy({ where: {} });
        await Flames.destroy({ where: {} });

        return interaction.createMessage({
          embeds: [
            {
              title: "Réinitialisation",
              description: "La base de données a été réinitialisée en entier ‼",
              color: 0xfc8917,
              timestamp: new Date().toISOString(),
            },
          ],
        });
      }
    } catch (error) {
      console.error(error);
      return interaction.createMessage({
        embeds: [
          {
            title: "Erreur",
            description: "Erreur de commande ❌",
            color: 0xfc8917,
            timestamp: new Date().toISOString(),
          },
        ],
      });
    }
  },
};