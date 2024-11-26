import { BotClient } from "./src/class/client";
import { config } from "./config";

const client = new BotClient(config.token);

(async () => {
  await client.initialize();
})();