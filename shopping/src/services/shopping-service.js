const { ShoppingRepository } = require("../database");
const { APIError, BadRequestError } = require("../utils/app-errors");

// All business logic will be here
class ShoppingService {
  constructor() {
    this.repository = new ShoppingRepository();
  }

  async getCart({ _id }) {
    try {
      const cartItems = await this.repository.Cart(_id);
    } catch (err) {
      throw new APIError("Unable to get cart");
    }
  }
}

module.exports = ShoppingService;
