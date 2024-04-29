const express = require("express");
const request = require("supertest");
const customer = require("../../api/customer");
const { DB_URL } = require("../../config");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const expressApp = require("../../express-app");

const app = new express();

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

describe("Signin and signup tests", () => {
  it.only("Should create a new user using valid credentials", async () => {
    const userData = {
      email: "test2@mail.com",
      password: "1234",
      phone: "1199999999",
    };
    const response = await request(app)
      .post("/customer/signup")
      .send(userData)
      .expect(201);
  });
});
