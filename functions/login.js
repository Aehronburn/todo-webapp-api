"use strict";

const connectToDB = require("../db");
const bcrypt = require("bcrypt");
const User = require("../models/User");

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
      return { statusCode: 400, body: "user not found" };
    }
    //comparazione password dato dal client con quello del db
    if (await bcrypt.compare(json.password, user[0].password)) {
      return { statusCode: 200, body: "user authenticated" };
    } else {
      return { statusCode: 401, body: "wrong password" };
    }
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      body: "error",
    };
  }
};
