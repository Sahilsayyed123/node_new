const { task } = require("../data/index");
class TaskService {
  async createTask(data) {
    try {
      const result = await task.create(data);
      return result;
    } catch (err) {
      console.log("Error creating task:", err);
    }
  }

  async getAllTasks() {
    try {
      const taskObj = await task.findAll();
      return taskObj;
    } catch (err) {
      console.log("Error fetching tasks:", err);
    }
  }
}

module.exports = new TaskService();
