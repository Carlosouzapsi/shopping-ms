const express = require("express");
const request = require("supertest");
const ProductService = require("../../services/product-service");
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
    expect(response.body.message).toBe("Product created successfully");
    expect(response.body.data).toHaveProperty("_id");
  });

  it("Should list products by category", async () => {
    const productData1 = {
      name: "ProductTes01",
      desc: "descProd01",
      type: "typeProd01",
      unit: 1,
      price: 50.0,
      available: true,
      suplier: "testSup01",
      banner: "Banner01",
    };
    const productData2 = {
      name: "ProductTes02",
      desc: "descProd02",
      type: "typeProd02",
      unit: 1,
      price: 50.0,
      available: true,
      suplier: "testSup02",
      banner: "Banner02",
    };

    const productData3 = {
      name: "ProductTes02",
      desc: "descProd02",
      type: "typeProd03",
      unit: 1,
      price: 50.0,
      available: true,
      suplier: "testSup02",
      banner: "Banner02",
    };

    await productService.CreateProduct(productData1);
    await productService.CreateProduct(productData2);
    await productService.CreateProduct(productData3);

    const productType = productData1.type;

    const response = await request(app)
      .get(`/category/${productType}`)
      .expect(200);
    expect(response.body).toHaveLength(2);
  });

  it("Should list the product by description", async () => {
    const productData = {
      name: "ProductTes01",
      desc: "listedByDesc001",
      type: "typeProd01",
      unit: 1,
      price: 50.0,
      available: true,
      suplier: "testSup01",
      banner: "Banner01",
    };
    const productResult = await productService.CreateProduct(productData);
    const response = await request(app)
      .get(`/${productResult.data._id}`)
      .expect(200);
    expect(response.data).toBe(productResult.desc);
  });

  it("Should list the products selected by Ids", async () => {
    const productData1 = {
      name: "ProductTes01",
      desc: "descProd01",
      type: "typeProd01",
      unit: 1,
      price: 50.0,
      available: true,
      suplier: "testSup01",
      banner: "Banner01",
    };
    const productData2 = {
      name: "ProductTes02",
      desc: "descProd02",
      type: "typeProd02",
      unit: 1,
      price: 50.0,
      available: true,
      suplier: "testSup02",
      banner: "Banner02",
    };

    const productData3 = {
      name: "ProductTes02",
      desc: "descProd02",
      type: "typeProd03",
      unit: 1,
      price: 50.0,
      available: true,
      suplier: "testSup02",
      banner: "Banner02",
    };
    const prodResult1 = await productService.CreateProduct(productData1);
    const prodResult2 = await productService.CreateProduct(productData2);
    const prodResult3 = await productService.CreateProduct(productData3);
    const selectedItemsbyId = [
      prodResult1.data._id,
      prodResult2.data._id,
      prodResult3.data._id,
    ];
    // WIP
    const response = await request(app)
      .post("/ids")
      .send({ ids: selectedItemsbyId })
      .expect(200);
    expect(response.body.data).toHaveLength(3);
    console.log(selectedItemsbyId[0]._id);
    expect(response.body.data[0]).toHaveProperty(
      "_id",
      selectedItemsbyId[0]._id.toString()
    );
    expect(response.body.data[1]).toHaveProperty(
      "_id",
      selectedItemsbyId[1]._id.toString()
    );
    expect(response.body.data[2]).toHaveProperty(
      "_id",
      selectedItemsbyId[2]._id.toString()
    );
  });

  it("Should list all products", async () => {
    const productData1 = {
      name: "ProductTes01",
      desc: "descProd01",
      type: "typeProd01",
      unit: 1,
      price: 50.0,
      available: true,
      suplier: "testSup01",
      banner: "Banner01",
    };
    const productData2 = {
      name: "ProductTes02",
      desc: "descProd02",
      type: "typeProd02",
      unit: 1,
      price: 50.0,
      available: true,
      suplier: "testSup02",
      banner: "Banner02",
    };
  });

  // TODO
  it("Should add the product at the wishlist", async () => {
    const productData1 = {
      name: "ProductTes01",
      desc: "descProd01",
      type: "typeProd01",
      unit: 1,
      price: 50.0,
      available: true,
      suplier: "testSup01",
      banner: "Banner01",
    };

    const productResult = await productService.CreateProduct(productData1);
  });
});
