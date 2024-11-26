import { Duo } from "../../db/models/Duo";
import { Flames } from "../../db/models/Flammes";

export default {
  name: "messageCreate",
  execute: async (message: any, client: any) => {
    try {
      if (!message.guildID && message.attachments?.length > 0) {
        const userId = message.author.id;

        const duo = await Duo.findOne({ where: { userId } });
        if (!duo) {
          if (message.channel && typeof message.channel.createMessage === "function") {
            return await message.channel.createMessage(
              "Vous n'êtes actuellement pas en duo. Pour créer un duo, veuillez utiliser `/askduo`"
            );
          }
          return;
        }

        const duoPartnerId = duo.partnerId;
        const flamesRecord = await Flames.findOne({
          where: { userId, partnerId: duoPartnerId },
        });

        const currentTime = new Date();
        if (
          flamesRecord &&
          flamesRecord.lastUpdate &&
          currentTime.getTime() - flamesRecord.lastUpdate.getTime() <
            24 * 60 * 60 * 1000 
        ) {
          if (message.channel && typeof message.channel.createMessage === "function") {
            return await message.channel.createMessage(
              `Vous avez déjà maintenu vos flammes avec <@${duoPartnerId}> dans les dernières 24 heures, vous pouvez envoyer autant d'images que vous voulez mais vos flammes ne seront pas augmentées 💡`
            );
          }
          return;
        }

        if (flamesRecord) {
          flamesRecord.count += 1;
          flamesRecord.lastUpdate = currentTime;
          await flamesRecord.save();
        } else {
          await Flames.create({
            userId,
            partnerId: duoPartnerId,
            count: 1,
            lastUpdate: currentTime,
          });
        }

        const updatedFlames = flamesRecord ? flamesRecord.count : 1;

        const duoPartner = client.users.get(duoPartnerId);
        if (duoPartner) {
          const dmChannel = await duoPartner.getDMChannel();
          await dmChannel.createMessage({
            content: `Une image a été envoyée par \`${message.author.username}\` pour maintenir vos **flammes** 🔥`,
            embed: {
              image: {
                url: message.attachments[0].url,
              },
            },
          });
        }

        if (message.channel && typeof message.channel.createMessage === "function") {
          return await message.channel.createMessage(
            `L'image a été envoyée à votre duo et vos flammes sont maintenant à **${updatedFlames}** 🔥`
          );
        }
      } else if (!message.guildID) {
        if (message.channel && typeof message.channel.createMessage === "function") {
          return await message.channel.createMessage(
            "Envoyez une image pour maintenir vos flammes ‼"
          );
        }
      }
    } catch (err) {
      console.error(err);
    }
  },
};