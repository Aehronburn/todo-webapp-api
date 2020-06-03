"use strict";

const connectToDB = require("../lib/db");
const authorize = require("../lib/authorize");
const Todo = require("../models/Todo");

module.exports.handler = async (event, context) => {
  if (!authorize(event.headers.Authorization)) {
    return {
      statusCode: 401,
      body: "Unauthenticated",
    };
  }
  //terminare sessione senza aspettare la chiusura del db
  context.callbackWaitsForEmptyEventLoop = false;

  //attesa connessione al db
  await connectToDB();
  try {
    await Todo.findByIdAndRemove(event.pathParameters.id);
    return {
      statusCode: 200,
      body: "todo removed successfully",
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      body: "error at removing todo",
    };
  }
};
