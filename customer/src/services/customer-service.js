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

  // TODO Criar teste de integração e Endpoint
  async GetShoppingDetails(id) {
    try {
      const existingCustomer = await this.repository.FindCustomerById({ id });

      if (existingCustomer) {
        return FormateData(existingCustomer);
      }
      return FormateData({ msg: "Error" });
    } catch (error) {
      throw new APIError("Data not Found");
    }
  }

  // TODO Criar teste de integração e Endpoint
  async GetWishList(customerId) {
    try {
      const wishListItems = await this.repository.WishList(customerId);
      return FormateData(wishListItems);
    } catch (error) {
      throw new APIError("Data not found", err);
    }
  }

  // TODO Criar teste de integração e Endpoint
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

  // TODO Criar teste de integração e Endpoint
  async ManageCart(customerId, product, qty, isRemove) {
    try {
      const cartResult = await this.repository.addCartItem(
        customerId,
        product,
        qty,
        isRemove
      );
      return FormateData(cartResult);
    } catch (err) {
      throw new APIError("Data not found", err);
    }
  }

  // TODO Criar teste de integração e Endpoint
  async ManageOrder(customerId, order) {
    try {
      const orderResult = await this.repository.AddOrderProfile(
        customerId,
        order
      );
      return FormateData(orderResult);
    } catch (error) {
      throw new APIError("Data not found", err);
    }
  }

  // TODO Criar teste de integração e Endpoint
  async SubscribeEvents(payload) {
    const { event, data } = payload;

    const { userId, product, order, qty } = data;

    switch (event) {
      case "ADD_TO_WISHLIST":
      case "REMOVE_FROM_WISHLIST":
        this.AddToWishList(userId, product);
        break;
      case "ADD_TO_CART":
        this.ManageCart(userId, product, qty, false);
        break;
      case "REMOVE_FROM_CART":
        this.ManageCart(userId, product, qty, true);
        break;
      case "CREATE_ORDER":
        this.ManageOrder(userId, order);
        break;
      default:
        break;
    }
  }
}

module.exports = CustomerService;
