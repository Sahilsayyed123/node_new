const sequelize = require("../config/database");
const UserModel = require("./user.model");
const TaskModel = require("./task.model");

const User = UserModel(sequelize);
const Task = TaskModel(sequelize);

const db = {
  sequelize,
  User,
  Task,
};
module.exports = db;
