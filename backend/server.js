require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const applicationsRoutes = require("./routes/application");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
connectDB();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/applications", applicationsRoutes);

// ✅ Health check
app.get("/", (req, res) => {
  res.status(200).send("Backend is live ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
