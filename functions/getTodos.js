"use strict";

const connectToDB = require("../db");
const Todo = require("../models/Todo");

module.exports.handler = async (event, context) => {
  //terminare sessione senza aspettare la chiusura del db
  context.callbackWaitsForEmptyEventLoop = false;

  //attesa connessione al db
  await connectToDB();

  try {
    const todos = await Todo.find({ group: event.pathParameters.groupID });
    return {
      statusCode: 200,
      body: JSON.stringify(todos),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      body: "error at retrieving todos",
    };
  }
};
