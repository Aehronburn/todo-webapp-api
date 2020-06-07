"use strict";

const connectToDB = require("../lib/db");
const authorize = require("../lib/authorize");
const Collection = require("../models/Collection");

module.exports.handler = async (event, context) => {
  if (!authorize(event.headers.Authorization)) {
    return {
      statusCode: 401,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: "Unauthenticated",
    };
  }
  //terminare sessione senza aspettare la chiusura del db
  context.callbackWaitsForEmptyEventLoop = false;

  //attesa connessione al db
  await connectToDB();

  const name = JSON.parse(event.body).name;

  try {
    let collection = new Collection({
      name: name,
      count: 0,
    });
    await collection.save();
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: "collection successfully created",
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: "error at creating new collection",
    };
  }
};
