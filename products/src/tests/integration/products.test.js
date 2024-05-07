const express = require("express");
const request = require("supertest");
const ProductService = require("../../services/products-service");
const { DB_URL } = require("../../config");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const expressApp = require("../../express-app");

const app = new express();
const productService = new ProductService();
/* Configurar arquivo jest para rodar testes de integração
separados dos unitários */

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = await mongoServer.getUri();
  await mongoose.connect(mongoUri, { dbName: DB_URL });

  await expressApp(app);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// TODO
describe("products tests", () => {
  it("Should create a new product", async () => {
    const productData = {
      name: "ProductTes01",
      desc: "descProd01",
      type: "typeProd01",
      unit: 1,
      price: 50.0,
      available: true,
      suplier: "testSup01",
      banner: "Banner01",
    };

    const response = await request(app)
      .post("/product/create")
      .send(productData)
      .expect(201);
    console.log(response.body);
  });
});
