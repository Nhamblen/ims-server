/**
 * Author: Noah Hamblen
 * Date: 24 November 2025
 * File: list_inventory.js
 * Description: Routing for the list inventory page
 */

const express = require("express");
const router = express.Router();
const InventoryItem = require("../models/inventory-item");

/**
 * GET /
 * Returns all inventory items in the database.
 * This route is called from the Angular client when the user
 * navigates to the inventory list page.
 */
router.get("/", async (req, res) => {
  try {
    // Query the InventoryItem collection for all items
    const items = await InventoryItem.find({});

    // Return the results as JSON with a 200 OK status
    return res.status(200).json(items);
  } catch (err) {
    // Log the error to the server console for debugging
    console.error("Error fetching inventory items:", err);

    // Return a 500 internal server error response
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Export the router so app.js can mount it under /api/inventory
module.exports = router;
