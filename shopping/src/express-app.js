const express = require("express");
const cors = require("cors");
const { shopping, appEvents } = require("./api");
const HandleErrors = require("./utils/error-handler");

module.exports = async (app) => {
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cors());
  app.use(express.static(__dirname + "/public"));

  // TO log all responses..
  // app.use((req, res, next) => {
  //   console.log(req);
  //   next();
  // });

  // Listen to Events //
  appEvents(app);

  //api
  shopping(app);

  // error handling
  app.use(HandleErrors);
};
