"use strict";

const connectToDB = require("../db");
const User = require("../models/User");
const bcrypt = require("bcrypt");

module.exports.handler = async (event, context) => {
  //terminare sessione senza aspettare la chiusura del db
  context.callbackWaitsForEmptyEventLoop = false;

  //attesa connessione al db
  await connectToDB();

  //lettura contenuto inviato dal client
  let json = JSON.parse(event.body);
  try {
    //verificare che lo username scelto non esista già
    const existingUser = await User.find({ username: json.username });
    if (existingUser) {
      return { statusCode: 409, body: "username already exists" };
    }
    //creazione hash della password + salt(10) per maggiore sicurezza
    const hashedPassword = await bcrypt.hash(json.password, 10);

    //creazione nuovo utente e salvataggio nel db
    const user = new User({
      username: json.username,
      password: hashedPassword,
    });
    await user.save();
    return {
      statusCode: 200,
      body: "user successfully registered",
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      body: "error",
    };
  }
};
