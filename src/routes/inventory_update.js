/**
 * Author: Noah Hamblen
 * Date: 6 December 2025
 * File: inventory_update.js
 * Description: Routing for the list inventory page
 */

const express = require("express");
const router = express.Router();
const InventoryItem = require("../models/inventory-item");

/**
 * PUT /:id
 * Updates an existing inventory item by its MongoDB _id.
 * The request body can contain one or more fields to update.
 */
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id; // The item ID from the URL
    const update = req.body; // The fields to update

    // Find the document by ID and apply the update.
    // new: true returns the updated document.
    const updatedItem = await InventoryItem.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    // If no document was found, return 404 Not Found
    if (!updatedItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    // Return the updated item with a 200 OK status
    return res.status(200).json(updatedItem);
  } catch (err) {
    console.error("Error updating inventory item:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Export the router so app.js can mount it under /api/inventory
module.exports = router;
