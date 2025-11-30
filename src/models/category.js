/**
 * Category Model
 * IMS Project
 */

const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  categoryId: { type: Number, required: true, unique: true },
  categoryName: { type: String, required: true, unique: true },
  description: { type: String },
  dateCreated: { type: Date, default: Date.now },
  dateModified: { type: Date, default: Date.now },
});

module.exports = mongoose.model("categories", CategorySchema);
