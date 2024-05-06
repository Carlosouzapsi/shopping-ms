const { ProductRepository } = require("../../database");
const { DB_URL } = require("../../config");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

let mongoServer;

const productRepository = new ProductRepository();

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

describe("customer tests", () => {
  it("should create a new product", async () => {
    const productData = {
      name: "product1",
      desc: "desc prod1",
      banner: "banner1",
      type: "typeTest",
      unit: 1,
      price: 30.0,
      available: true,
      suplier: "testSupplier",
    };
    const productResult = await productRepository.CreateProduct(productData);

    console.log(productResult);
    expect(productResult).toHaveProperty("_id");
  });
});
