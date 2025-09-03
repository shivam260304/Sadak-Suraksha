// Report Schema update (models/Report.js)
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    priority: { type: String, required: true },
    imageUrl: { type: String }, // User uploaded image
    adminImageUrl: { type: String }, // Admin uploaded image
    adminRemarks: { type: String, default: "" }, // Admin remarks field
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["Submitted", "Under Review", "In Progress", "Resolved", "Rejected"],
      default: "Submitted",
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
