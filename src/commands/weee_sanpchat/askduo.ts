import { Duo } from "../../db/models/Duo";

export default {
  name: "askduo",
  description: "Demander à quelqu'un s'il veut faire un duo",
  options: [
    {
      name: "membre",
      description: "Le membre que vous souhaitez être en duo",
      type: 6,
      required: true,
    },
  ],
  execute: async (interaction: any, client: any) => {
    try {
      const memberId = interaction.data.options[0].value;
      const guildId = interaction.guildID;
      const guild = client.guilds.get(guildId);

      if (!guild) {
        return await interaction.createMessage({
          content: "Commande uniquement utilisable sur un serveur ❌",
          flags: 64,
        });
      }

      const member = guild.members.get(memberId);

      if (!member) {
        return await interaction.createMessage({
          content: "Le membre spécifié est introuvable ❌",
          flags: 64,
        });
      }

      if (member.bot) {
        return await interaction.createMessage({
          content: "Tu ne peux pas demander à un bot en duo...❌",
          flags: 64,
        });
      }

      if (member.id === interaction.member.id) {
        return await interaction.createMessage({
          content: "Tu ne peux pas te demander en duo...❌",
          flags: 64,
        });
      }

      const existingDuo = await Duo.findOne({ where: { userId: interaction.member.id } });
      if (existingDuo) {
        return await interaction.createMessage({
          content: "Tu es déjà en duo avec quelqu'un ❌",
          flags: 64,
        });
      }

      const pendingRequest = await Duo.findOne({ where: { partnerId: interaction.member.id } });
      if (pendingRequest) {
        return await interaction.createMessage({
          content: "Tu as déjà une demande de duo en attente ❌",
          flags: 64,
        });
      }

      const targetPendingRequest = await Duo.findOne({ where: { partnerId: member.id } });
      if (targetPendingRequest) {
        return await interaction.createMessage({
          content: "La personne cible a déjà une demande de duo en attente ❌",
          flags: 64,
        });
      }

      const botUser = client.user;
      const botAvatar = botUser.dynamicAvatarURL("png", 1024);
      await Duo.create({ userId: interaction.member.id, partnerId: member.id });

      const dmEmbed = {
        description: `${interaction.member.mention} vous a envoyé une demande de duo. Souhaitez-vous accepter cette demande ?`,
        color: 0xfc8917,
        footer: {
          text: botUser.username,
          icon_url: botAvatar,
        },
        thumbnail: {
          url: botAvatar,
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
            custom_id: `accept_duo_${interaction.member.id}`,
          },
          {
            type: 2,
            label: "Non",
            style: 4,
            custom_id: `decline_duo_${interaction.member.id}`,
          },
        ],
      };

      try {
        const dmChannel = await member.user.getDMChannel();
        await dmChannel.createMessage({
          embeds: [dmEmbed],
          components: [buttons],
        });

        const embed = {
          description: `${member.mention} a reçu votre demande de duo. Il ne lui reste plus qu'à l'accepter ou la refuser`,
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

        await interaction.createMessage({
          embeds: [embed],
        });
      } catch (err) {
        await interaction.createMessage({
          content: "Le membre a désactivé ses messages privés ❌",
          flags: 64,
        });
      }
    } catch (err) {
      console.error(err);
      await interaction.createMessage({
        content: "Erreur de commande ❌",
        flags: 64,
      });
    }
  },

  handleButtonInteraction: async (interaction: any, client: any) => {
    const [action, type, requesterId] = interaction.data.custom_id.split("_");
    if (type !== "duo") return;

    try {
      await interaction.deferUpdate();

      const userId = interaction.member?.id || interaction.user?.id;

      if (!userId) {
        return;
      }

      const duoRequest = await Duo.findOne({ where: { partnerId: userId, userId: requesterId } });
      if (!duoRequest) {
        return;
      }

      const botUser = client.user;
      const botAvatar = botUser.dynamicAvatarURL("png", 1024);

      let embed;
      if (action === "accept") {
        await Duo.destroy({ where: { partnerId: userId } });
        await Duo.create({ userId, partnerId: requesterId });
        await Duo.create({ userId: requesterId, partnerId: userId });

        embed = {
          description: `Vous êtes maintenant en duo avec <@${requesterId}>`,
          color: 0xfc8917,
          footer: {
            text: botUser.username,
            icon_url: botAvatar,
          },
          thumbnail: {
            url: botAvatar,
          },
          timestamp: new Date().toISOString(),
        };
      } else if (action === "decline") {
        await Duo.destroy({ where: { partnerId: userId } });

        embed = {
          description: "Demande de duo refusée",
          color: 0xfc8917,
          footer: {
            text: botUser.username,
            icon_url: botAvatar,
          },
          thumbnail: {
            url: botAvatar,
          },
          timestamp: new Date().toISOString(),
        };
      }

      if (interaction.message) {
        await interaction.message.edit({
          embeds: [embed],
          components: [],
        });
      }
    } catch (err) {
      console.error(err);
      await interaction.createMessage({
        content: "Erreur d'interaction ❌",
        flags: 64,
      });
    }
  },
};