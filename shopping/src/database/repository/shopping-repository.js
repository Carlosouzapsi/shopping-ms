const { ProductModel } = require("../models");
const {
  APIError,
  BadRequestError,
  STATUS_CODES,
} = require("../../utils/app-errors");
const { v4: uuidv4 } = require("uuid");

class ShoppingRepository {
  async Orders(customerId) {
    try {
      const orders = await OrderModel.find({ customerId });
      return orders;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Orders"
      );
    }
  }

  async Cart(customerId) {
    try {
      const cartItems = await CartModel.find({
        customerId: customerId,
      });
      if (cartItems) {
        return cartItems;
      }
    } catch (err) {
      throw new APIError("Data not Found!");
    }
  }

  async AddCartItem(customerId, item, qty, isRemove) {
    try {
      const cart = await CartModel.findOne({ customerId: customerId });

      const { _id } = item;

      if (cart) {
        let isExist = false;

        let cartItems = cart.items;

        if (cartItems.length > 0) {
          cartItems.map((item) => {
            if (item.product._id.toString() === _id.toString()) {
              if (isRemove) {
                cartItems.splice(cartItems.indexOf(item, 1));
              } else {
                item.unit = qty;
              }
              isExist = true;
            }
          });
        }
        if (!isExist && !isRemove) {
          cartItems.push({ product: { ...item }, unit: qty });
        }
        cart.items = cartItems;
        return await cart.save();
      } else {
        return await CartModel.create({
          customerId,
          items: [{ product: { ...item }, unit: qty }],
        });
      }
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create Customer"
      );
    }
  }

  async CreateNewOrder(customerId, txnId) {
    try {
      const cart = await CartModel.findOne({ customerId: customerId });
      if (cart) {
        let amount = 0;
        let cartItems = cart.items;

        if (cartItems.length > 0) {
          // Process Order
          cartItems.map((item) => {
            amount += parseInt(item.product.price) * parseInt(item.unit);
          });

          const orderId = uuidv4();

          const order = new OrderModel({
            orderId,
            customerId,
            amount,
            txnId,
            status: "received",
            items: cartItems,
          });
          cart = cart.items = [];

          const orderResult = await order.save();

          await cart.save();

          return orderResult;
        }
      }
      return {};
    } catch (err) {
      throw new APIError("Unable to Find a new order");
    }
  }
}

module.exports = ShoppingRepository;
