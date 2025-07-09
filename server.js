const express = require("express");
const db = require("./src/models/index.js"); // this contains sequelize + models
const cors = require("cors");
const helmet = require("helmet");
const { jwtMiddleware } = require("./src/middleware/jwt.middleware");

const app = express();

// Initialize WebSocket
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

// Apply JWT middleware globally (except for public routes)
app.use(jwtMiddleware);

app.get("/", (req, res) => {
  res.send("Sequelize + MySQL working!");
});
const routes = require("./src/routes");
app.use("/", routes);

db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database synced");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
      console.log("WebSocket server is ready for connections");
    });
  })
  .catch((err) => console.error("DB connection failed:", err));
