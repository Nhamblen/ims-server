/**
 * Author: John Kuronya
 * Date: 24 November 2025
 * File: Inventory_create.spec.js
 * Description: Test the create inventory route.
 */

const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

const InventoryItem = require("../../src/models/inventory-item");
const inventoryCreateRoutes = require("../../src/routes/create_inventory");

// Small Express app just for this test suite
const app = express();
app.use(express.json());
app.use("/api/inventory", inventoryCreateRoutes);

beforeAll(async () => {
  // Connect to MongoDB using the URI from .env
  await mongoose.connect(process.env.MONGO_URI);

  // Clean the collection before running the tests
  await InventoryItem.deleteMany({});
});

afterAll(async () => {
  // Close DB connection after all tests
  await mongoose.connection.close();
});

describe("POST /api/inventory", () => {
  it("should create a new inventory item when given valid data", async () => {
    const newItem = {
      categoryId: 1,
      supplierId: 100,
      name: "Test Item 1",
      description: "A test inventory item",
      quantity: 50,
      price: 9.99,
    };

    const res = await request(app)
      .post("/api/inventory")
      .send(newItem);

    // Expect a successful creation (change to 200 if your route uses 200 instead)
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.name).toBe(newItem.name);
    expect(res.body.quantity).toBe(newItem.quantity);

    // Verify it really saved in MongoDB
    const inDb = await InventoryItem.findOne({ name: newItem.name });
    expect(inDb).not.toBeNull();
    expect(inDb.quantity).toBe(newItem.quantity);
    expect(inDb.price).toBe(newItem.price);
  });

  it("should return 400 when required fields are missing", async () => {
    // Missing name and quantity
    const badItem = {
      categoryId: 1,
      supplierId: 100,
      price: 9.99,
    };

    const res = await request(app)
      .post("/api/inventory")
      .send(badItem);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("should return 409 when an item with the same name already exists", async () => {
    const item = {
      categoryId: 1,
      supplierId: 100,
      name: "Duplicate Name Item",
      description: "First one",
      quantity: 20,
      price: 4.99,
    };

    // First create succeeds
    const firstRes = await request(app)
      .post("/api/inventory")
      .send(item);

    expect(firstRes.status).toBe(201);

    // Second create with same name should fail
    const secondRes = await request(app)
      .post("/api/inventory")
      .send({ ...item, description: "Second one" });

    expect(secondRes.status).toBe(409);
    expect(secondRes.body).toHaveProperty("message");
  });
});
