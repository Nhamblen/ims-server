/**
 * Author: John Kuronya
 * Date: 16 December 2025
 * File: create_supplier.js
 * Description: API route for creating a supplier.
 */

const express = require("express");
const router = express.Router();
const Supplier = require("../models/supplier"); // uses your existing model

/**
 * POST /api/suppliers
 * Creates a new supplier document.
 */
router.post("/", async (req, res) => {
  try {
    const { supplierId, supplierName, contactInformation, address } = req.body;

    const missingFields = [];
    if (supplierId === undefined || supplierId === null) {
      missingFields.push("supplierId");
    }
    if (!supplierName) {
      missingFields.push("supplierName");
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const supplier = new Supplier({
      supplierId,
      supplierName,
      contactInformation,
      address,
      // dateCreated/dateModified will use defaults in schema
    });

    const saved = await supplier.save();

    return res.status(201).json(saved);
  } catch (err) {
    console.error("Error creating supplier:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
