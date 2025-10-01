const express = require("express");
const Application = require("../models/application");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE Application
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { position, company, date, status, followup, notes } = req.body;

    const newApplication = new Application({
      user: req.user._id, // from JWT
      position,
      company,
      date,
      status,
      followup,
      notes,
    });

    const savedApplication = await newApplication.save();
    res.status(201).json(savedApplication);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all applications of logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single application by id
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ error: "Application not found" });

    if (app.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    res.json(app);
  } catch (err) {
    res.status(400).json({ error: "Invalid application id" });
  }
});

// UPDATE application
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    let app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ error: "Application not found" });

    if (app.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    app = await Application.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(app);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE application
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ error: "Application not found" });

    if (app.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await app.deleteOne();
    res.json({ message: "Application deleted" });
  } catch (err) {
    res.status(400).json({ error: "Invalid application id" });
  }
});

module.exports = router;
