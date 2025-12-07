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
const updateInventoryRoutes = require("../../src/routes/inventory_update");
require("dotenv").config(); // loads .env
let seededItemId; // will hold the _id of the seeded test item

const app = express();
app.use(express.json());

// Mount the route being tested
app.use("/api/inventory", listInventoryRoutes);
app.use("/api/inventory", updateInventoryRoutes);

/**
 * Connect to the test database and test insert one inventory item (separate from inventory_items collection).
 * This runs once before all tests.
 */
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // Clear existing records
  await InventoryItem.deleteMany();

  // Insert a test item and capture its _id
  const seededItem = await InventoryItem.create({
    categoryId: 1000,
    supplierId: 1,
    name: "Update Test Item",
    description: "Original description",
    quantity: 5,
    price: 100.0,
  });

  // Store the id so tests can use it
  seededItemId = seededItem._id.toString();
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
