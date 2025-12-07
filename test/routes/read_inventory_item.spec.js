/**
 * Author: John Kuronya
 * Date: 5 December 2025
 * File: read_inventory_item.spec.js
 * Description: Tests for the read-inventory-by-id route.
 */

const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const InventoryItem = require("../../src/models/inventory-item");
const readInventoryRoutes = require("../../src/routes/read_inventory");
require("dotenv").config(); // loads .env

const app = express();
app.use(express.json());

// Mount ONLY the read-by-id route for these tests
app.use("/api/inventory", readInventoryRoutes);

let existingItemId;

/**
 * Connect to the test database and insert one inventory item
 * before all tests run.
 */
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // Clear collection to avoid test pollution
  await InventoryItem.deleteMany();

  // Insert a known item we can fetch by ID
  const created = await InventoryItem.create({
    categoryId: 2000,
    supplierId: 2,
    name: "Read Test Item",
    description: "Item used for read-by-id tests",
    quantity: 5,
    price: 49.99,
  });

  existingItemId = created._id.toString();
});

/**
 * Close the Mongo connection after the test suite finishes.
 */
afterAll(async () => {
  await mongoose.connection.close();
});

//
// TEST 1: Should return 200 and the item for a valid existing ID
//
it("should return 200 and the inventory item when a valid ID exists", async () => {
  const response = await request(app).get(`/api/inventory/${existingItemId}`);

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("_id", existingItemId);
  expect(response.body).toHaveProperty("name", "Read Test Item");
  expect(response.body).toHaveProperty("quantity", 5);
  expect(response.body).toHaveProperty("price", 49.99);
});

//
// TEST 2: Should return 404 when no item exists for the given valid ID
//
it("should return 404 when no inventory item exists for the given ID", async () => {
  // Generate a valid ObjectId that is not in the collection
  const nonExistentId = new mongoose.Types.ObjectId().toString();

  const response = await request(app).get(`/api/inventory/${nonExistentId}`);

  expect(response.status).toBe(404);
  expect(response.body).toHaveProperty("message", "Inventory item not found");
});

//
// TEST 3: Should return 400 for an invalid MongoDB ObjectId
//
it("should return 400 when the ID is not a valid ObjectId", async () => {
  const invalidId = "not-a-valid-id";

  const response = await request(app).get(`/api/inventory/${invalidId}`);

  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty("message", "Invalid inventory ID");
});
