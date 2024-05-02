const express = require("express");
const request = require("supertest");
const CustomerService = require("../../services/customer-service");
const { DB_URL } = require("../../config");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const expressApp = require("../../express-app");

const app = new express();
const customerService = new CustomerService();
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

describe("customer tests", () => {
  let token;
  it("Should create a new user using valid credentials", async () => {
    const userData = {
      email: "test2@mail.com",
      password: "1234",
      phone: "1199999999",
    };
    const response = await request(app)
      .post("/customer/signup")
      .send(userData)
      .expect(201);
    expect(response.body.message).toBe("Customer signed up successfully");
    expect(response.body.data).toHaveProperty("id");
  });

  it("Should do login with valid credentials", async () => {
    const userData = {
      email: "test2@mail.com",
      password: "1234",
      phone: "1199999999",
    };
    await customerService.signUp(userData);

    const response = await request(app)
      .post("/customer/login")
      .send({ email: userData.email, password: userData.password })
      .expect(200);

    expect(response.body.data).toHaveProperty("token");
  });
  it("Should create a new address", async () => {
    const userData = {
      email: "test2@mail.com",
      password: "1234",
      phone: "1199999999",
    };
    const newUser = await customerService.signUp(userData);
    const signedUser = await customerService.signIn({
      email: userData.email,
      password: userData.password,
    });
    const response = await request(app)
      .post("/customer/address")
      .set("Authorization", `Bearer ${signedUser.data.token}`);
    console.log(response.body);
  });
});
