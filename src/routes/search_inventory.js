/**
 * Author: Noah Hamblen
 * Date: 8 December 2025
 * File: search_inventory.js
 * Description: Search the inventory API.
 */

const express = require("express");
const router = express.Router();
const InventoryItem = require("../models/inventory-item");

router.get("/search", async (req, res) => {
  try {
    const { name, categoryId, supplierId } = req.query;

    const filter = {};

    if (name) filter.name = new RegExp(name, "i"); // case-insensitive
    if (categoryId) filter.categoryId = Number(categoryId);
    if (supplierId) filter.supplierId = Number(supplierId);

    if (Object.keys(filter).length === 0) {
      return res.status(400).json({ message: "No search criteria provided." });
    }

    const results = await InventoryItem.find(filter);
    return res.status(200).json(results);
  } catch (err) {
    console.error("Search error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
