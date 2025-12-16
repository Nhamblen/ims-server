/**
 * Author: John Kuronya
 * Date: 16 December 2025
 * File: create_supplier.spec.js
 * Description: Tests for the create supplier route.
 */

const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const Supplier = require("../../src/models/supplier");
const createSupplierRoutes = require("../../src/routes/create_supplier");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use("/api/suppliers", createSupplierRoutes);

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Supplier.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

/**
 * 1. Should create a supplier and return 201 with the saved document
 */
it("should create a supplier and return 201 with the saved document", async () => {
  const supplierData = {
    supplierId: 100,
    supplierName: "Tech Supplier",
    contactInformation: "133-456-7890",
    address: "123 Apple Ave",
  };

  const response = await request(app)
    .post("/api/suppliers")
    .send(supplierData);

  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty("_id");
  expect(response.body).toHaveProperty("supplierId", supplierData.supplierId);
  expect(response.body).toHaveProperty("supplierName", supplierData.supplierName);
  expect(response.body).toHaveProperty(
    "contactInformation",
    supplierData.contactInformation
  );
  expect(response.body).toHaveProperty("address", supplierData.address);
  expect(response.body).toHaveProperty("dateCreated");
  expect(response.body).toHaveProperty("dateModified");

  const fromDb = await Supplier.findById(response.body._id);
  expect(fromDb).not.toBeNull();
  expect(fromDb.supplierId).toBe(supplierData.supplierId);
});

/**
 * 2. Should return 400 when required fields are missing
 */
it("should return 400 when required fields are missing", async () => {
  const badSupplier = {
    // supplierId is missing
    supplierName: "No ID Supplier",
    contactInformation: "111-222-3333",
    address: "999 Nowhere St",
  };

  const response = await request(app)
    .post("/api/suppliers")
    .send(badSupplier);

  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty("message");
  expect(response.body.message).toMatch(/Missing required fields/);
  expect(response.body.message).toMatch(/supplierId/);
});

/**
 * 3. Should allow creating multiple suppliers with different supplierIds
 */
it("should allow creating multiple suppliers with different supplierIds", async () => {
  const supplier1 = {
    supplierId: 101,
    supplierName: "Supplier One",
    contactInformation: "555-000-0001",
    address: "1 Supplier St",
  };

  const supplier2 = {
    supplierId: 102,
    supplierName: "Supplier Two",
    contactInformation: "555-000-0002",
    address: "2 Supplier Ave",
  };

  const res1 = await request(app).post("/api/suppliers").send(supplier1);
  const res2 = await request(app).post("/api/suppliers").send(supplier2);

  expect(res1.status).toBe(201);
  expect(res2.status).toBe(201);
});
