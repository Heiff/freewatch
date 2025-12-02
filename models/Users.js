const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

class Users extends Model {}

Users.init(
  {
    chatId: {
    type: DataTypes.BIGINT,
    unique: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true,
  }
  },
  {
    sequelize,
    tableName: "users",
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Users