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

  context.callbackWaitsForEmptyEventLoop = false;

  await connectToDB();

  const name = JSON.parse(event.body);

  try {
    await Collection.findOneAndUpdate(event.pathParameters.id, name);
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: "collection name updated successfully",
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: "error at updating collection name",
    };
  }
};
