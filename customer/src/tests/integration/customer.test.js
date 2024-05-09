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
  // Tobe improved...
  it("Should create a new address", async () => {
    const addressData = {
      street: "street 001",
      postalCode: "888-888",
      city: "Test City",
      country: "Test Country",
    };

    const userData = {
      email: "test2@mail.com",
      password: "1234",
      phone: "1199999999",
    };
    await customerService.signUp(userData);
    const signedUser = await customerService.signIn({
      email: userData.email,
      password: userData.password,
    });
    const response = await request(app)
      .post("/customer/address")
      .send(addressData)
      .set("Authorization", `Bearer ${signedUser.data.token}`)
      .expect(201);
    expect(response.body.data.address[0].street).toBe(addressData.street);
    expect(response.body.data.address[0].postalCode).toBe(
      addressData.postalCode
    );
    expect(response.body.data.address[0].city).toBe(addressData.city);
    expect(response.body.data.address[0].country).toBe(addressData.country);
    expect(response.body.data.address[0]._id).toBeDefined();
  });
  // Tobe improved...
  it("Should get user profile", async () => {
    const addressData = {
      street: "street 001",
      postalCode: "888-888",
      city: "Test City",
      country: "Test Country",
    };

    const userData = {
      email: "test2@mail.com",
      password: "1234",
      phone: "1199999999",
    };
    await customerService.signUp(userData);
    const signedUser = await customerService.signIn({
      email: userData.email,
      password: userData.password,
    });
    const { id } = signedUser.data;
    const userAdd = await customerService.AddNewAddress(id, {
      street: addressData.street,
      postalCode: addressData.postalCode,
      city: addressData.city,
      country: addressData.country,
    });

    const response = await request(app)
      .get("/profile")
      .set("Authorization", `Bearer ${signedUser.data.token}`)
      .expect(200);
  });
  // Tobe improved...
  it("Should get shopping details", async () => {
    const addressData = {
      street: "street 001",
      postalCode: "888-888",
      city: "Test City",
      country: "Test Country",
    };

    const userData = {
      email: "test2@mail.com",
      password: "1234",
      phone: "1199999999",
    };
    await customerService.signUp(userData);
    const signedUser = await customerService.signIn({
      email: userData.email,
      password: userData.password,
    });
    const response = await request(app)
      .get("/shopping-details")
      .set("Authorization", `Bearer ${signedUser.data.token}`);
    console.log(response.body.data);
  });
  // Tobe improved...
  it("Should get the wishlist", async () => {
    const addressData = {
      street: "street 001",
      postalCode: "888-888",
      city: "Test City",
      country: "Test Country",
    };

    const userData = {
      email: "test2@mail.com",
      password: "1234",
      phone: "1199999999",
    };
    await customerService.signUp(userData);
    const signedUser = await customerService.signIn({
      email: userData.email,
      password: userData.password,
    });
    const response = await request(app)
      .get("/wishlist")
      .set("Authorization", `Bearer ${signedUser.data.token}`);
  });
});
