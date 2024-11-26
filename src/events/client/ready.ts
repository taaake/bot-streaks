import chalk from "chalk";

export default {
    name: "ready",
    execute: async (client: any) => {
        console.log(chalk.green("[C]") + ` Connecté sur ${client.user.username}`);

        client.editStatus("idle", {
            name: "🔥 github.com/taaake",
            type: 0,
        });
    },
};