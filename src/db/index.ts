import { Sequelize } from "sequelize";
import chalk from "chalk";

export const sequelize = new Sequelize("snapchat", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log(chalk.green("[DB]") + " Connexion réussie à la db");
  } catch (error) {
    console.log(chalk.red("[X]") + " ❌ Impossible de se connecter à la db :", error);
    process.exit(1);
  }
};