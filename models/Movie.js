const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

class Movie extends Model {}

Movie.init(
  {
    film: {
      type: DataTypes.STRING,
      unique: true,      // nom unique
      allowNull: false,
    },
    janr: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    yil: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    message_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    file_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    thumb_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "movie",
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Movie