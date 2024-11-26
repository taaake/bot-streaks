import { QuickDB } from "quick.db";
const db = new QuickDB();

export const checkFlammes = async (client: any) => {
  const allDuos = await db.all();

  for (const record of allDuos) {
    if (record.id.startsWith("flammes_")) {
      const [_, userId, duoPartnerId] = record.id.split("_");
      const lastImageTimestamp = await db.get(
        `lastImage_${userId}_${duoPartnerId}`
      );

      if (!lastImageTimestamp) {
        await db.set(`flammes_${userId}_${duoPartnerId}`, 0);
        continue;
      }

      const currentTime = Date.now();
      const timeDifference = currentTime - lastImageTimestamp;

      if (timeDifference > 24 * 60 * 60 * 1000) {
        await db.set(`flammes_${userId}_${duoPartnerId}`, 0);
        const user = client.users.get(userId);
        const duoPartner = client.users.get(duoPartnerId);

        if (user && duoPartner) {
          user.createDM().then((dm: any) =>
            dm.createMessage({
              content: ` Vos flammes avec \${duoPartner.username}\ a été réinitialisé car aucune image n'a été envoyée dans les 24 dernières heures...`,
            })
          );
          duoPartner.createDM().then((dm: any) =>
            dm.createMessage({
              content: `Votre flammes avec \${user.username}\ a été réinitialisé car aucune image n'a été envoyée dans les 24 dernières heures...`,
            })
          );
        }
      }
    }
  }
};