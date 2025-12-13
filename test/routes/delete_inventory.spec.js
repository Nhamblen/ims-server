/**
 * Author: John Kuronya
 * Date: 8 December 2025
 * File: delete_inventory.spec.js
 * Description: Tests for the delete-inventory-by-id route.
 */

const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const InventoryItem = require("../../src/models/inventory-item");
const deleteInventoryRoutes = require("../../src/routes/delete_inventory");
require("dotenv").config();

const app = express();
app.use(express.json());

// Mount ONLY the delete route for these tests
app.use("/api/inventory", deleteInventoryRoutes);

let existingItemId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // Clear any previous data to avoid test interference
  await InventoryItem.deleteMany();

  // Insert a test record for deletion
  const created = await InventoryItem.create({
    categoryId: 5,
    supplierId: 10,
    name: "Delete Test Item",
    description: "Item used for delete tests",
    quantity: 7,
    price: 29.99,
  });

  existingItemId = created._id.toString();
});

afterAll(async () => {
  await mongoose.connection.close();
});

/**
 * 1. Should delete existing item and return 200
 */
it("should return 200 and a success message when a valid existing ID is deleted", async () => {
  const response = await request(app).delete(`/api/inventory/${existingItemId}`);

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty(
    "message",
    "Inventory item deleted successfully"
  );
  expect(response.body).toHaveProperty("id", existingItemId);

  // Optional: confirm it's really gone
  const itemInDb = await InventoryItem.findById(existingItemId);
  expect(itemInDb).toBeNull();
});

/**
 * 2. Should return 404 when a valid but non-existent ID is provided
 */
it("should return 404 when no inventory item exists for the given valid ID", async () => {
  const nonExistentId = new mongoose.Types.ObjectId().toString();

  const response = await request(app).delete(
    `/api/inventory/${nonExistentId}`
  );

  expect(response.status).toBe(404);
  expect(response.body).toHaveProperty("message", "Inventory item not found");
});

/**
 * 3. Should return 400 when the ID is not a valid ObjectId
 */
it("should return 400 when the ID is not a valid ObjectId", async () => {
  const invalidId = "not-a-valid-id";

  const response = await request(app).delete(`/api/inventory/${invalidId}`);

  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty("message", "Invalid inventory ID");
});
