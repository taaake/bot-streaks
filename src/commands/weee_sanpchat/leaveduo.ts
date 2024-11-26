import { Duo } from "../../db/models/Duo";
import { Flames } from "../../db/models/Flammes";

export default {
  name: "leaveduo",
  description: "Quittez votre duo actuel",
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
              title: "Erreur",
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

      const confirmEmbed = {
        description:
          "Souhaitez-vous vraiment quitter votre duo ? Vous allez perdre toutes vos flammes",
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

      const buttons = {
        type: 1,
        components: [
          {
            type: 2,
            label: "Oui",
            style: 3,
            custom_id: `confirm_leave_${userId}`,
          },
          {
            type: 2,
            label: "Non",
            style: 4,
            custom_id: `cancel_leave_${userId}`,
          },
        ],
      };

      return interaction.createMessage({
        embeds: [confirmEmbed],
        components: [buttons],
      });
    } catch (err) {
      console.error(err);

      const botUser = client.user;
      const botAvatar = botUser.dynamicAvatarURL("png", 1024);

      await interaction.createMessage({
        embeds: [
          {
            title: "Erreur",
            description:
              "Une erreur est survenue lors de l'exécution de la commande. Merci de réessayer et si l'erreur persiste, veuillez contacter un owner du serveur",
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
  },

  handleButtonInteraction: async (interaction: any, client: any) => {
    const [action, type, userId] = interaction.data.custom_id.split("_");

    if (type !== "leave") return;

    const botUser = client.user;
    const botAvatar = botUser.dynamicAvatarURL("png", 1024);

    if (interaction.member.id !== userId) {
      return interaction.createMessage({
        embeds: [
          {
            title: "Erreur",
            description: "Vous n'avez pas la permission d'utiliser ce bouton",
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
        flags: 64,
      });
    }

    try {
      if (action === "confirm" && interaction.member.id === userId) {
        const duo = await Duo.findOne({ where: { userId } });
        if (!duo) {
          return interaction.createMessage({
            embeds: [
              {
                title: "Erreur",
                description: "Votre duo a déjà été dissous",
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
        await Duo.destroy({ where: { userId } });
        await Duo.destroy({ where: { userId: duoPartnerId } });

        await Flames.destroy({
          where: {
            userId,
            partnerId: duoPartnerId,
          },
        });
        await Flames.destroy({
          where: {
            userId: duoPartnerId,
            partnerId: userId,
          },
        });

        const embed = {
          description: "Votre duo a été supprimé",
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

        return interaction.message.edit({
          embeds: [embed],
          components: [],
        });
      } else if (action === "cancel" && interaction.member.id === userId) {
        const cancelEmbed = {
          description: "Action annulée, vous restez dans votre duo actuel",
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

        return interaction.message.edit({
          embeds: [cancelEmbed],
          components: [],
        });
      }
    } catch (err) {
      console.error(err);

      await interaction.createMessage({
        embeds: [
          {
            title: "Erreur",
            description:
              "Une erreur est survenue lors de l'interaction. Merci de réessayer et si l'erreur persiste, veuillez contacter un owner du serveur",
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
  },
};