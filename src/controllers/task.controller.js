const taskService = require("../services/task.service");

class TaskController {
  async createTask(req, res) {
    try {
      const taskData = req.body;
      if (taskData) {
        const taskObj = await taskService.createTask(taskData);
        res.status(201).json(taskObj);
      } else {
        res.status(400).json({ error: "Task data is null or undefined" });
      }
    } catch (err) {
      console.error("Error creating task:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getAllTasks(req, res) {
    try {
      const tasks = await taskService.getAllTasks();
      res.status(200).json(tasks);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new TaskController();
