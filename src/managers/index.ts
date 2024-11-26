import { checkFlammes } from "./user/FlammesManager";

export const runManagers = async (client: any) => {
  await checkFlammes(client);
};