const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    priority: { type: String, required: true },
    imageUrl: { type: String }, // We'll store just the file name or a URL for images
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);
