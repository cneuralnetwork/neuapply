const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }, // link to user
  position: { type: String, required: true },
  company: { type: String, required: true },
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ["applied", "waiting", "interview", "accepted", "rejected"],
    default: "applied"
  },
  followup: { type: Date, default: null },
  notes: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Application", ApplicationSchema);
