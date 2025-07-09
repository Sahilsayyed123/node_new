const { Task, User } = require("../models");
const taskData = require("./task.data");
const userData = require("./user.data");

let task = taskData(Task);
let user = userData(User);

module.exports = {
  task,
  user,
};
