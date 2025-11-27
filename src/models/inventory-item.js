/**
 * Inventory Item Model
 * IMS Project
 */

const mongoose = require("mongoose");

const InventoryItemSchema = new mongoose.Schema({
  categoryId: { type: Number, required: true },
  supplierId: { type: Number, required: true },
  name: { type: String, required: true, unique: true },
  description: { type: String },
  quantity: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  dateCreated: { type: Date, default: Date.now },
  dateModified: { type: Date, default: Date.now },
});

module.exports = mongoose.model("InventoryItem", InventoryItemSchema);
