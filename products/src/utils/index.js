const { APP_SECRET } = require("../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Utility functions
module.exports.GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

module.exports.GeneratePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

module.exports.ValidatePassword = async (
  enteredPassword,
  savedPassword,
  salt
) => {
  return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword;
};

module.exports.GenerateSignature = async (payload) => {
  try {
    return await jwt.sign(payload, "jg_youtube_tutorial", { expiresIn: "30d" });
    // return await jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
  } catch (err) {
    console.log(err);
    return err;
  }
};

module.exports.ValidateSignature = async (req) => {
  try {
    const signature = req.get("Authorization");
    // console.log(signature);
    // const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
    const payload = await jwt.verify(
      signature.split(" ")[1],
      "jg_youtube_tutorial"
    );
    req.user = payload;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports.FormateData = (data) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};
