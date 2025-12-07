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

// Test 2: Should actually update the quantity field on the item.
it("should update the quantity field", async () => {
  const newQuantity = 20;

  const response = await request(app)
    .put(`/api/inventory/${seededItemId}`)
    .send({ quantity: newQuantity });

  expect(response.status).toBe(200);
  expect(response.body.quantity).toBe(newQuantity);
});

// Test 3: Should return 404 when trying to update a non-existent item.
it("should return 404 for a non-existent item ID", async () => {
  // Random ObjectId string
  const fakeId = "000000000000000000000000";

  const response = await request(app)
    .put(`/api/inventory/${fakeId}`)
    .send({ quantity: 50 });

  expect(response.status).toBe(404);
  expect(response.body).toHaveProperty("message", "Inventory item not found");
});
