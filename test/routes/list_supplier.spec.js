/**
 * Author: Noah Hamblen
 * Date: 14 December 2025
 * File: list_inventory.spec.js
 * Description: Test the list inventory route.
 */

const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const Supplier = require("../../src/models/supplier");
const listSupplierRoutes = require("../../src/routes/list_supplier");
require("dotenv").config(); // loads .env

const app = express();
app.use(express.json());

// Mount the route being tested
app.use("/api/supplier", listSupplierRoutes);

/**
 * Connect to the test database and test insert one supplier.
 * This runs once before all tests.
 */
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // Clear any previous data to avoid test pollution
  await Supplier.deleteMany();

  // Insert a test record for validation
  await Supplier.insertMany([
    {
      supplierId: 100,
      supplierName: "Tech Supplier",
      contactInformation: "133-456-7890",
      address: "123 Apple Ave",
    },
    {
      supplierId: 200,
      supplierName: "Furniture Sales",
      contactInformation: "555-555-5555",
      address: "454 Oak Street",
    },
  ]);
});

/**
 * Close the Mongo connection after the test suite finishes.
 */
afterAll(async () => {
  await mongoose.connection.close();
});

// TEST 1: Should return 200 OK
it("should return status 200", async () => {
  const response = await request(app).get("/api/supplier");
  expect(response.status).toBe(200);
});

// TEST 2: Should return an array
it("should return an array of items", async () => {
  const response = await request(app).get("/api/supplier");
  expect(Array.isArray(response.body)).toBe(true);
});

// TEST 3: Should contain required fields
it("should return items with name and contact", async () => {
  const response = await request(app).get("/api/supplier");
  const supplier = response.body[0];

  expect(supplier).toHaveProperty("supplierName");
  expect(supplier).toHaveProperty("contactInformation");
});
