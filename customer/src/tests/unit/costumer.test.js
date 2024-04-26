const express = require("express");
const CustomerRepository = require("../../database/repository/customer-repository");
const { DB_URL } = require("../../config");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const app = express();

let mongoServer;

const customerRepository = new CustomerRepository();

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
  it("Should create a new customer", async () => {
    const customerResult = await customerRepository.CreateCustomer({
      email: "test1@email.com",
      password: "1234",
      phone: "1199999999",
      address: [],
    });

    expect(customerResult.email).toBe("test1@email.com");
    expect(customerResult.password).toBe("1234");
    expect(customerResult.phone).toBe("1199999999");
  });
  it("Should create an adress to the customer", async () => {
    const baseCustomer = await customerRepository.CreateCustomer({
      email: "test2@email.com",
      password: "1234",
      phone: "1199999999",
      address: [],
    });
    const customerAddress = await customerRepository.CreateAddress({
      _id: baseCustomer._id,
      street: "street avenue 1",
      postalCode: "55555",
      city: "MyWonderfullTown",
      country: "US",
    });

    expect(customerAddress._id).toBeDefined();
    expect(customerAddress.street).toBe(customerAddress.street);
    expect(customerAddress.postalCode).toBe(customerAddress.city);
    expect(customerAddress.city).toBe(customerAddress.country);
  });

  it("Should find a customer by email", async () => {
    const baseCustomer = await customerRepository.CreateCustomer({
      email: "test3@email.com",
      password: "1234",
      phone: "1199999999",
      address: [],
    });

    const customerResultByEmail = await customerRepository.FindCustomer({
      email: baseCustomer.email,
    });

    console.log(customerResultByEmail);
    expect(customerResultByEmail.email).toBe(baseCustomer.email);
    expect(customerResultByEmail.password).toBe(baseCustomer.password);
    expect(customerResultByEmail.phone).toBe(baseCustomer.phone);
    // expect(customerResultByEmail.address).toBe(baseCustomer.address);
  });
});
