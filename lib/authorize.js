const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = authorize = (token) => {
  if (!token) {
    return false;
  } else {
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      return true;
    } catch (error) {
      return false;
    }
  }
};
