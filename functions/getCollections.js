"use strict";

const connectToDB = require("../lib/db");
const authorize = require("../lib/authorize");
const updateCount = require("../lib/updateCount");
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
  try {
    let collections = await Collection.find();
    let updatedCollections = await Promise.all(
      collections.map(async (collection) => {
        await updateCount(collection);
      })
    );
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(collections),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: "error at retrieving collections",
    };
  }
};
