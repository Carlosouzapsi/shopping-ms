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

describe("products tests", () => {
  it("Should create a new product", async () => {
    const productData = {
      name: "product1",
      desc: "desc prod1",
      type: "typeTest",
      unit: 1,
      price: 30.0,
      available: true,
      suplier: "testSupplier",
      banner: "banner1",
    };
    const productResult = await productRepository.CreateProduct(productData);

    expect(productResult).toHaveProperty("_id");
  });
  it("Should list all products", async () => {
    const productData1 = {
      name: "product1",
      desc: "desc prod1",
      banner: "banner1",
      type: "typeTest",
      unit: 1,
      price: 30.0,
      available: true,
      suplier: "testSupplier",
    };
    const productData2 = {
      name: "product1",
      desc: "desc prod1",
      banner: "banner1",
      type: "typeTest",
      unit: 1,
      price: 30.0,
      available: true,
      suplier: "testSupplier",
    };
    await productRepository.CreateProduct(productData1);
    await productRepository.CreateProduct(productData2);
    const prodListResult = await productRepository.Products();
    expect(prodListResult).toHaveLength(3);
  });

  it("Should find a product by Id", async () => {
    const productData = {
      name: "productyById1",
      desc: "desc prodById1",
      banner: "bannerById1",
      type: "typeTestById",
      unit: 1,
      price: 30.0,
      available: true,
      suplier: "testSupplierById",
    };
    const productResult = await productRepository.CreateProduct(productData);
    const productFindByIdResult = await productRepository.FindById(
      productResult._id
    );
    expect(productFindByIdResult.name).toBe(productData.name);
  });

  it("Should find a product by Category", async () => {
    const productData = {
      name: "productTest",
      desc: "desc prodTest",
      banner: "bannerByTest",
      type: "productByCategoryTest",
      unit: 1,
      price: 30.0,
      available: true,
      suplier: "testSupplierById",
    };
    await productRepository.CreateProduct(productData);
    const productResultByCategory = await productRepository.FindByCategory(
      productData.type
    );
    expect(productData.type).toBe(productResultByCategory[0].type);
  });
  // To be improved
  it("Should find selected products", async () => {
    const productData1 = {
      name: "product1",
      desc: "desc prod1",
      banner: "banner1",
      type: "typeTest",
      unit: 1,
      price: 30.0,
      available: true,
      suplier: "testSupplier",
    };
    const productData2 = {
      name: "product2",
      desc: "desc prod2",
      banner: "banner2",
      type: "typeTest2",
      unit: 1,
      price: 30.0,
      available: true,
      suplier: "testSupplier",
    };
    const productResult1 = await productRepository.CreateProduct(productData1);
    const productResult2 = await productRepository.CreateProduct(productData2);
    const selectedItemsbyId = [productResult1._id, productResult2._id];
    const selectedProductsResult = await productRepository.FindSelectedProducts(
      selectedItemsbyId
    );
    expect(selectedItemsbyId).toHaveLength(2);
    expect(selectedItemsbyId[0]._id).toBe(productResult1._id);
    expect(selectedItemsbyId[1]._id).toBe(productResult2._id);
  });
});
