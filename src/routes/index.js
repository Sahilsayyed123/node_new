const router = require("express").Router();
const taskRoute = require("./task.route");
const websocketRoute = require("./websocket.route");
const authRoute = require("./auth.route");
router.use("/tasks", taskRoute);
router.use("/websocket", websocketRoute);
router.use("/auth", authRoute);
module.exports = router;
