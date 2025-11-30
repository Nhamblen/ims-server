/**
 * Author: Noah Hamblen
 * Date: 24 November 2025
 * File: list_inventory.spec.js
 * Description: Test the list inventory route.
 */

const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const InventoryItem = require("../../src/models/inventory-item");
const listInventoryRoutes = require("../../src/routes/list_inventory");
require("dotenv").config(); // loads .env

const app = express();
app.use(express.json());

// Mount the route being tested
app.use("/api/inventory", listInventoryRoutes);

/**
 * Connect to the test database and test insert one inventory item (separate from inventory_items collection).
 * This runs once before all tests.
 */
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // Clear any previous data to avoid test pollution
  await InventoryItem.deleteMany();

  // Insert a test record for validation
  await InventoryItem.insertMany([
    {
      categoryId: 1000,
      supplierId: 1,
      name: "Test Item 1",
      description: "Test description",
      quantity: 10,
      price: 199.99,
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
  const response = await request(app).get("/api/inventory");
  expect(response.status).toBe(200);
});

// TEST 2: Should return an array
it("should return an array of items", async () => {
  const response = await request(app).get("/api/inventory");
  expect(Array.isArray(response.body)).toBe(true);
});

// TEST 3: Should contain required fields
it("should return items with name and quantity", async () => {
  const response = await request(app).get("/api/inventory");
  const item = response.body[0];

  expect(item).toHaveProperty("name");
  expect(item).toHaveProperty("quantity");
});
