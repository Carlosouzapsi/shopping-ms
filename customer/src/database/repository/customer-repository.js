const { CustomerModel, AddressModel } = require("../models");
const {
  APIError,
  BadRequestError,
  STATUS_CODES,
} = require("../../utils/app-errors");

class CustomerRepository {
  async CreateCustomer({ email, password, phone, salt }) {
    // Inserir regras de negócio de email diferente..
    try {
      const customer = new CustomerModel({
        email,
        password,
        phone,
        address: [],
      });
      const customerResult = await customer.save();
      return customerResult;
    } catch (err) {
      throw APIError(
        "API Error",
        STATUS_CODES.INTERNAR_ERROR,
        "Unable to Create Customer"
      );
    }
  }

  async CreateAddress({ _id, street, postalCode, city, country }) {
    try {
      const profile = await CustomerModel.findById(_id);

      if (profile) {
        const newAddress = new AddressModel({
          street,
          postalCode,
          city,
          country,
        });

        await newAddress.save();
        profile.address.push(newAddress);
      }

      return await profile.save();
    } catch (error) {
      throw APIError(
        "API Error",
        STATUS_CODES.INTERNAR_ERROR,
        "Error on Create Address"
      );
    }
  }

  async FindCustomer({ email }) {
    try {
      const existingCustomer = await CustomerModel.findOne({ email: email });
      return existingCustomer;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES_INTERNAL_ERROR,
        "Unable to Find Customer"
      );
    }
  }
}

module.exports = CustomerRepository;