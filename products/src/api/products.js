const ProductService = require("../services/products-service");
const { PublishCustomerEvent, PublishShoppingEvent } = require("../utils");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new ProductService();

  app.post("/product/create", async (req, res, next) => {
    try {
      const { name, desc, type, unit, price, available, suplier, banner } =
        req.body;
      const { data } = await service.CreateProduct({
        name,
        desc,
        type,
        unit,
        price,
        available,
        suplier,
        banner,
      });
      return res.status(201).json({
        message: "Product created successfully",
        data: data,
      });
    } catch (err) {
      next(err);
    }
  });
};
