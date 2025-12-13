/**
 * Author: John Kuronya
 * Date: 8 December 2025
 * File: delete_inventory.js
 * Description: API route for deleting an inventory item by ID.
 */

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const InventoryItem = require("../models/inventory-item");

/**
 * DELETE /api/inventory/:id
 * Deletes a single inventory item by its MongoDB _id.
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid inventory ID",
      });
    }

    const deleted = await InventoryItem.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        message: "Inventory item not found",
      });
    }

    return res.status(200).json({
      message: "Inventory item deleted successfully",
      id: deleted._id,
    });
  } catch (err) {
    console.error("Error deleting inventory item:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
