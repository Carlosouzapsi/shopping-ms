const CustomerService = require("../services/customer-service");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new CustomerService();

  app.post("/customer/signup", async (req, res, next) => {
    try {
      const { email, password, phone } = req.body;
      const { data } = await service.signUp({ email, password, phone });
      // return res.json(data);
      return res.status(201).json({
        message: "Customer signed up successfully",
        data: data,
      });
    } catch (err) {
      next(err);
    }
  });
};
