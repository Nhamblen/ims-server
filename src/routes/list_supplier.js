/**
 * Author: Noah Hamblen
 * Date: 14 December 2025
 * File: list_inventory.js
 * Description: Routing for the list inventory page
 */

const express = require("express");
const router = express.Router();
const Supplier = require("../models/supplier");

// GET /api/suppliers
router.get("/", async (req, res) => {
  try {
    // Query the InventoryItem collection for all items
    const suppliers = await Supplier.find({});

    // Return the results as JSON with a 200 OK status
    return res.status(200).json(suppliers);
  } catch (err) {
    // Log the error to the server console for debugging
    console.error("Error fetching suppliers:", err);

    // Return a 500 internal server error response
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Export the router so app.js can mount it under /api/inventory
module.exports = router;
