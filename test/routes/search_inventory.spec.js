/**
 * Author: Noah Hamblen
 * Date: 8 December 2025
 * File: search_inventory.spec.js
 * Description: Search the inventory tests.
 */

const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const InventoryItem = require("../../src/models/inventory-item");
const searchRoutes = require("../../src/routes/search_inventory");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use("/api/inventory", searchRoutes);

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await InventoryItem.deleteMany();

  await InventoryItem.insertMany([
    { name: "Laptop", categoryId: 1, supplierId: 1, quantity: 10, price: 999 },
    { name: "Mouse", categoryId: 1, supplierId: 1, quantity: 25, price: 25 },
  ]);
});

afterAll(async () => {
  await mongoose.connection.close();
});

// TEST 1: should return 200 OK
it("should return 200 for valid search", async () => {
  const res = await request(app).get("/api/inventory/search?name=lap");
  expect(res.status).toBe(200);
});

// TEST 2: should return matching items
it("should return items that match search query", async () => {
  const res = await request(app).get("/api/inventory/search?name=laptop");
  expect(res.body.length).toBe(1);
  expect(res.body[0].name).toBe("Laptop");
});

// TEST 3: missing search term → 400
it("should return 400 if no name is provided", async () => {
  const res = await request(app).get("/api/inventory/search");
  expect(res.status).toBe(400);
});
