const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    hackathonId: { type: String, trim: true, default: "" },
    title: { type: String, required: true, trim: true },
    channels: { type: [String], default: [] },
    frequency: { type: String, default: "daily", trim: true },
    enabled: { type: Boolean, default: true },
    alertTime: { type: Date, required: true, index: true },
    settings: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, collection: "Alerts" }
);

module.exports = mongoose.model("Alert", alertSchema);
