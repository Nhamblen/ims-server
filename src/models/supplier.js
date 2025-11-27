/**
 * Supplier Model
 * IMS Project
 */

const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema({
  supplierId: { type: Number, required: true, unique: true },
  supplierName: { type: String, required: true, unique: true },
  contactInformation: { type: String },
  address: { type: String },
  dateCreated: { type: Date, default: Date.now },
  dateModified: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Supplier", SupplierSchema);
