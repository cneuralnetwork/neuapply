require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const applicationsRoutes = require("./routes/application");

// Importing the necessary modules and configurations

const app = express();

app.use(cors({      // Enabling CORS for all origins or a specific one
    // This allows the server to accept requests from different origins
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],

    allowedHeaders: ["Content-Type", "Authorization"],  // Specifying allowed headers for requests
    credentials: true,  // Allowing credentials to be included in requests
}));

app.use(express.json());    // Middleware to parse JSON request bodies

connectDB();

app.use("/api/v1/auth", authRoutes);    // Importing and using authentication routes
app.use("/api/v1/applications", applicationsRoutes);  // Importing and using application routes


// ✅ Add this health check route
app.get("/", (req, res) => {
  res.status(200).send("Backend is live ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});