const ProductsService = require("../services/product-service");

module.exports = (app) => {
  const service = new ProductsService();

  app.use("/app-events", async (req, res, next) => {
    const { payload } = req.body;

    service.SubscribeEvents(payload);
    console.log(
      "============================ Products Service receive Event ======"
    );
    return res.status(200).json(payload);
  });
};
