const { ShoppingRepository } = require("../../database");
const { DB_URL } = require("../../config");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

let mongoServer;

const ShoppingRepository = new ShoppingRepository();

/* Configurar arquivo jest para rodar testes de integração
separados dos unitários */
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = await mongoServer.getUri();
  await mongoose.connect(mongoUri, { dbName: DB_URL });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("shopping tests", () => {});
