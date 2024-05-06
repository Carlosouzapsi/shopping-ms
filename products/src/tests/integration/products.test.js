const express = require("express");
const request = require("supertest");
const ProductsService = require("../../services/products-service");
const { DB_URL } = require("../../config");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const expressApp = require("../../express-app");

const app = new express();
const productsService = new ProductsService();
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

describe("products tests", () => {
  it("Should create a new product", async () => {});
});
