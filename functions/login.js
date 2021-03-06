"use strict";

const jwt = require("jsonwebtoken");
const connectToDB = require("../lib/db");
const bcrypt = require("bcrypt");
const User = require("../models/User");
require("dotenv").config();

module.exports.handler = async (event, context) => {
  //terminare sessione senza aspettare la chiusura del db
  context.callbackWaitsForEmptyEventLoop = false;

  //attesa connessione al db
  await connectToDB();

  //lettura contenuto inviato dal client
  const json = JSON.parse(event.body);

  try {
    //cercare se l'utente esiste nel db
    const user = await User.find({ username: json.username });
    //utente non trovato
    if (user[0] == null) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: "user not found",
      };
    }
    //comparazione password dato dal client con quello del db
    if (await bcrypt.compare(json.password, user[0].password)) {
      const token = jwt.sign({ userID: user[0]._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({token}),
      };
    } else {
      return {
        statusCode: 401,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: "wrong password",
      };
    }
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: "error",
    };
  }
};
