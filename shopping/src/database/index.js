const ShoppingRepository = require("./repository/shopping-repository");

module.exports = {
  databaseConnection: require("./connection"),
  ShoppingRepository: require("./repository/shopping-repository"),
};
