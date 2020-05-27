const mongoose = require("mongoose");
require("dotenv").config();

let isConnected;

module.exports = connectToDB = async () => {
  if (isConnected) {
    return Promise.resolve;
  }
  const db = await mongoose.connect(process.env.DB_URL);
  isConnected = db.connections[0].readyState;
};
