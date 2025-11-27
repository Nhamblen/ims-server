/**
 * Author: Noah Hamblen
 * Date: 24 November 2025
 * File: list_inventory.js
 * Description: Routing for the list inventory page
 */

const express = require("express");
const router = express.Router();
const InventoryItem = require("../models/inventory-item");

// GET all inventory items
router.get("/", async (req, res) => {
  try {
    const items = await InventoryItem.find({});
    return res.status(200).json(items);
  } catch (err) {
    console.error("Error fetching inventory items:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
