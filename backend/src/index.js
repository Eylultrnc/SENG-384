const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/post.routes");
const userRoutes = require("./routes/user.routes");
const messageRoutes = require("./routes/message.routes");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "Backend is running" });
});

app.get("/api/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB connection failed" });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
}); 