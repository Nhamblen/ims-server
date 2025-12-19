/**
 * Author: John Kuronya
 * File: read_inventory.js
 * Description: API route for reading a single inventory item by ID.
 */

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const InventoryItem = require("../models/inventory-item");

/**
 * GET /api/inventory/:id
 * Reads a single inventory item by its MongoDB _id.
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid inventory ID",
      });
    }

    // ✅ USE InventoryItem here
    const item = await InventoryItem.findById(id);

    if (!item) {
      return res.status(404).json({
        message: "Inventory item not found",
      });
    }

    return res.status(200).json(item);
  } catch (err) {
    console.error("Error reading inventory item by ID:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
