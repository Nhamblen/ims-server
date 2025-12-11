/**
 * Author: Noah Hamblen
 * Date: 8 December 2025
 * File: search_inventory.js
 * Description: Search the inventory API.
 */

const express = require("express");
const router = express.Router();
const InventoryItem = require("../models/inventory-item");

// GET /api/inventory/search?name=laptop
router.get("/search", async (req, res) => {
  try {
    const name = req.query.name;

    if (!name) {
      return res.status(400).json({ message: "Search term required" });
    }

    const items = await InventoryItem.find({
      name: { $regex: name, $options: "i" },
    });

    return res.status(200).json(items);
  } catch (err) {
    console.error("Search error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
