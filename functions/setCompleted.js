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

  const completed = JSON.parse(event.body);

  try {
    await Todo.findByIdAndUpdate(event.pathParameters.id, completed);
    return {
      statusCode: 200,
      body: "todo updated successfully",
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      body: "error at updating completion",
    };
  }
};
