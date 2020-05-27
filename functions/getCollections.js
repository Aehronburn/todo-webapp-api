"use strict";

const connectToDB = require("../db");
const Collection = require("../models/Collection");

module.exports.handler = async (event, context) => {
  //terminare sessione senza aspettare la chiusura del db
  context.callbackWaitsForEmptyEventLoop = false;

  //attesa connessione al db
  await connectToDB();

  try {
    const collections = await Collection.find();
    return {
      statusCode: 200,
      body: JSON.stringify(collections),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: "error at retrieving collections",
    };
  }
};
