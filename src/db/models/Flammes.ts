import { DataTypes, Model } from "sequelize";
import { sequelize } from "../index";

export class Flames extends Model {
  public userId!: string;
  public partnerId!: string;
  public count!: number;
  public lastUpdate!: Date;
}

Flames.init(
  {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    partnerId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lastUpdate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Flammes",
    tableName: "flammes",
    timestamps: false,
  }
);