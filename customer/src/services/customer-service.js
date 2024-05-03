const { CustomerRepository } = require("../database");
const {
  FormateData,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
} = require("../utils");
const { APIError, BadRequestError } = require("../utils/app-errors");

// All business logic will be here
class CustomerService {
  constructor() {
    this.repository = new CustomerRepository();
  }

  async signIn(userInputs) {
    const { email, password } = userInputs;

    try {
      const existingCustomer = await this.repository.FindCustomer({ email });

      if (existingCustomer) {
        const validPassword = await ValidatePassword(
          password,
          existingCustomer.password,
          existingCustomer.salt
        );
        if (validPassword) {
          const token = await GenerateSignature({
            email: existingCustomer.email,
            _id: existingCustomer._id,
          });
          return FormateData({ id: existingCustomer._id, token });
        }
      }

      return FormateData(null);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async signUp(userInputs) {
    const { email, password, phone } = userInputs;

    try {
      let salt = await GenerateSalt();
      let userPassword = await GeneratePassword(password, salt);

      const existingCustomer = await this.repository.CreateCustomer({
        email,
        password: userPassword,
        phone,
        salt,
      });

      const token = await GenerateSignature({
        email: email,
        _id: existingCustomer._id,
      });

      return FormateData({ id: existingCustomer._id, token });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async AddNewAddress(_id, userInputs) {
    const { street, postalCode, city, country } = userInputs;

    try {
      const addressResult = await this.repository.CreateAddress({
        _id,
        street,
        postalCode,
        city,
        country,
      });
      return FormateData(addressResult);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async GetProfile(id) {
    try {
      const existingCustomer = await this.repository.FindCustomerById({ id });
      return existingCustomer;
    } catch (err) {
      throw new APIError("Data not found!", err);
    }
  }

  // TODO Criar teste de integração
  async GetShoppingDetails(id) {
    try {
      const existingCustomer = await this.repository.FindCustomerById({ id });

      if (existingCustomer) {
        return FormateData({ msg: "Error" });
      }
    } catch (error) {
      throw new APIError("Data not Found");
    }
  }

  // TODO Criar teste de integração
  async GetWishList(customerId) {
    try {
      const wishListItems = await this.repository.WishList(customerId);
      return FormateData(wishListItems);
    } catch (error) {
      throw new APIError("Data not found", err);
    }
  }

  async AddToWishList(customerId, product) {
    try {
      const wishListResult = await this.repository.AddWishlistItem(
        customerId,
        product
      );
      return FormateData(wishListResult);
    } catch (err) {
      throw new APIError("Data not found", err);
    }
  }

  async ManageCart(customerId, product, qty, isRemoved) {
    try {
      const cartResult = await this.repository.addCartItem(
        customerId,
        product,
        qty,
        isRemoved
      );
      return FormateData(cartResult);
    } catch (err) {
      throw new APIError("Data not found", err);
    }
  }
}

module.exports = CustomerService;
