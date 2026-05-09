const adminRoutes = require("./routes/admin.routes");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/post.routes");
const userRoutes = require("./routes/user.routes");
const messageRoutes = require("./routes/message.routes");
const feedbackRoutes = require("./routes/feedback.routes");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

const mountRoutes = (prefix = "") => {
  app.get(`${prefix}/health`, (req, res) => {
    res.json({ message: "Backend is running" });
  });

  app.get(`${prefix}/db-test`, async (req, res) => {
    try {
      const result = await pool.query("SELECT NOW()");
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "DB connection failed" });
    }
  });

  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/posts`, postRoutes);
  app.use(`${prefix}/users`, userRoutes);
  app.use(`${prefix}/messages`, messageRoutes);
  app.use(`${prefix}/admin`, adminRoutes);
  app.use(`${prefix}/feedbacks`, feedbackRoutes);
};

// Mount routes at /api for local development compatibility
mountRoutes("/api");
// Mount routes at / for Vercel Serverless where /api is stripped
mountRoutes("");

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
}); 

module.exports = app;