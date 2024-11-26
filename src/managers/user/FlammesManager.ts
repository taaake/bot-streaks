import { Flames } from "../../db/models/Flammes";
import { Duo } from "../../db/models/Duo";

export const checkFlammes = async (client: any) => {
  const allDuos = await Duo.findAll();
  for (const duo of allDuos) {
    const { userId, partnerId } = duo;
    let flameRecord = await Flames.findOne({
      where: { userId, partnerId },
    });

    if (!flameRecord) {
      flameRecord = await Flames.create({
        userId,
        partnerId,
        count: 0,
        lastUpdate: new Date(0),
      });
    }

    const currentTime = Date.now();
    const lastUpdateTime = new Date(flameRecord.lastUpdate).getTime();
    const timeDifference = currentTime - lastUpdateTime;
    if (timeDifference > 24 * 60 * 60 * 1000) {
      flameRecord.count = 0;
      await flameRecord.save();
      const user = client.users.get(userId);
      const duoPartner = client.users.get(partnerId);
      if (user && duoPartner) {
        try {
          const userDM = await user.createDM();
          const partnerDM = await duoPartner.createDM();
          await userDM.send(
            `Vos flammes avec ${duoPartner.username} ont été réinitialisées car aucune image n'a été envoyée dans les 24 dernières heures...`
          );

          await partnerDM.send(
            `Vos flammes avec ${user.username} ont été réinitialisées car aucune image n'a été envoyée dans les 24 dernières heures...`
          );
        } catch (error) {
          console.error(
            `Erreur lors de l'envoi du message aux utilisateurs ${userId} et ${partnerId}: `,
            error
          );
        }
      }
    }
  }
};
