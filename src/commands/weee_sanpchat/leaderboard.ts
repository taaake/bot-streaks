import { Flames } from "../../db/models/Flammes";
import { Duo } from "../../db/models/Duo";

export default {
  name: "leaderboard",
  description: "Afficher le leaderboard des duos avec le plus de flammes",
  execute: async (interaction: any, client: any) => {
    try {
      const botUser = client.user;
      const botAvatar = botUser.dynamicAvatarURL("png", 1024);
      const allFlames = await Flames.findAll();
      const duoFlames: { duo: string; flames: number }[] = [];

      for (const flame of allFlames) {
        const user = client.users.get(flame.userId);
        const duoPartner = client.users.get(flame.partnerId);

        if (user && duoPartner) {
          duoFlames.push({
            duo: `\`${user.username}\` & \`${duoPartner.username}\``,
            flames: flame.count,
          });
        }
      }

      duoFlames.sort((a, b) => b.flames - a.flames);
      const top10 = duoFlames.slice(0, 10);

      let leaderboardDescription = top10
        .map(
          (entry, index) =>
            `${index + 1}. ${entry.duo} | ${entry.flames} 🔥`
        )
        .join("\n");

      if (leaderboardDescription === "") {
        leaderboardDescription = "Rien à afficher 💔";
      }

      const leaderboardEmbed = {
        title: "Leaderboard",
        description: leaderboardDescription,
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
        embeds: [leaderboardEmbed],
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