const { DataTypes } = require("sequelize");

const TaskModel = (sequelize) =>
  sequelize.define("Task", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    taskName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    taskType: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    task: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
module.exports = TaskModel;
