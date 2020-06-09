"use strict";

const connectToDB = require("../lib/db");
const authorize = require("../lib/authorize");
const Collection = require("../models/Collection");
const Todo = require("../models/Todo");

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

  try {
    await Collection.findByIdAndRemove(event.pathParameters.id);
    await Todo.deleteMany({ group: event.pathParameters.id });
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: "Collection removed successfully",
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: "error at removing collection",
    };
  }
};
