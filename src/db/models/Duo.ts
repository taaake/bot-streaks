import { DataTypes, Model } from "sequelize";
import { sequelize } from "../index";

export class Duo extends Model {
  public userId!: string;
  public partnerId!: string;
}

Duo.init(
  {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    partnerId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Duo",
    tableName: "duos",
    timestamps: false,
  }
);