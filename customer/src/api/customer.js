const CustomerService = require("../services/customer-service");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new CustomerService();

  app.post("/customer/signup", async (req, res, next) => {
    try {
      const { email, password, phone } = req.body;
      const { data } = await service.signUp({ email, password, phone });
      return res.status(201).json({
        message: "Customer signed up successfully",
        data: data,
      });
    } catch (err) {
      next(err);
    }
  });

  app.post("/customer/login", async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const { data } = await service.signIn({ email, password });

      return res.status(200).json({
        data: data,
      });
    } catch (err) {
      next(err);
    }
  });

  app.post("/customer/address", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;

      const { street, postalCode, city, country } = req.body;

      const { data } = await service.AddNewAddress(_id, {
        street,
        postalCode,
        city,
        country,
      });

      return res.status(201).json({
        message: "New address added successfully",
        data: data,
      });
    } catch (err) {
      next(err);
    }
  });

  app.get("/profile", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await service.GetProfile({ _id });
      return res.status(200).json({
        data: data,
      });
    } catch (error) {
      next(err);
    }
  });

  app.get("/shopping-details", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;

      const { data } = await service.GetShoppingDetails({ _id });
      return res.status(200).json({
        data: data,
      });
    } catch (err) {
      next(err);
    }
  });

  app.get("/wishlist", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await service.GetWishList({ _id });
      return res.status(200).json({
        data: data,
      });
    } catch (err) {
      next(err);
    }
  });
};
