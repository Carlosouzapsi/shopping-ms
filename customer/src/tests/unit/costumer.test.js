const { CustomerRepository } = require("../../database");
const { DB_URL } = require("../../config");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

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

describe.skip("customer tests", () => {
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

  // Criar teste para validar erro ao criar cliente
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

    expect(customerResultByEmail.email).toBe(baseCustomer.email);
    expect(customerResultByEmail.password).toBe(baseCustomer.password);
    expect(customerResultByEmail.phone).toBe(baseCustomer.phone);
    expect(customerResultByEmail.address).toBeDefined();
  });
  it("Should find a costumer by Id", async () => {
    const baseCustomer = await customerRepository.CreateCustomer({
      email: "test4@email.com",
      password: "1234",
      phone: "1199999999",
      address: [],
    });

    const customerResultFindById = await customerRepository.FindCustomerById({
      id: baseCustomer._id,
    });

    expect(customerResultFindById._id).toBeDefined();
    expect(customerResultFindById.email).toBe(baseCustomer.email);
    expect(customerResultFindById.password).toBe(baseCustomer.password);
    expect(customerResultFindById.phone).toBe(baseCustomer.phone);
  });
  // TODO
  it("Should add an item at the wish list", async () => {
    const baseCustomer = await customerRepository.CreateCustomer({
      email: "test6@email.com",
      password: "1234",
      phone: "1199999999",
      address: [],
    });

    const addItemWishList = customerRepository.AddWishlistItem(
      baseCustomer._id,
      {
        _id: "11223311",
        name: "itemName",
        desc: "ItemDesc",
        price: 199,
        available: true,
        banner: "banner",
      }
    );

    console.log(addItemWishList);
  });

  // TODO
  it.skip("Should find the wishlist by the customer id", async () => {
    const customerWishListResultFindById = await customerRepository.WishList(
      baseCustomer._id
    );
    console.log(baseCustomer._id);
    console.log(customerWishListResultFindById);
  });
});
