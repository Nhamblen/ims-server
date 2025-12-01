/**
 * Author: John Kuronya
 * Date: 24 November 2025
 * File: create_inventory.js
 * Description: Route for creating inventory items.
 */

const express = require('express');
const router = express.Router();
const InventoryItem = require('../models/inventory-item');

// POST /api/inventory  -> create an inventory item
router.post('/', async (req, res, next) => {
  try {
    const {
      categoryId,
      supplierId,
      name,
      description,
      quantity,
      price
    } = req.body;

    // Basic manual validation (on top of Mongoose)
    if (
      categoryId === undefined ||
      supplierId === undefined ||
      !name ||
      quantity === undefined ||
      price === undefined
    ) {
      return res.status(400).json({
        message:
          'Missing required fields: categoryId, supplierId, name, quantity, price'
      });
    }

    if (quantity < 0 || price < 0) {
      return res.status(400).json({
        message: 'Quantity and price must be non-negative'
      });
    }

    const item = await InventoryItem.create({
      categoryId,
      supplierId,
      name,
      description,
      quantity,
      price
    });

    return res.status(201).json(item);
  } catch (err) {
    // Duplicate key error (unique name)
    if (err.code === 11000) {
      return res.status(409).json({
        message: 'An inventory item with this name already exists.'
      });
    }

    // Validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation failed',
        errors: err.errors
      });
    }

    // global error handler will handle unexpected errors
    return next(err);
  }
});

module.exports = router;
