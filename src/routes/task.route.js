const routes = require("express").Router();
const router = routes;
const TaskController = require("../controllers/task.controller");
router.post("/", TaskController.createTask);
router.get("/", TaskController.getAllTasks);
module.exports = router;
