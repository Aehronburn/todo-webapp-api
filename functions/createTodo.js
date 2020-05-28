"use strict";

const connectToDB = require("../db");
const Todo = require("../models/Todo");

module.exports.handler = async (event, context) => {
  //terminare sessione senza aspettare la chiusura del db
  context.callbackWaitsForEmptyEventLoop = false;

  //attesa connessione al db
  await connectToDB();

  const json = JSON.parse(event.body);
  console.log(json);

  try {
    const todo = new Todo({
      title: json.title,
      date: new Date(),
      author: json.author,
      completed: false,
      group: json.group,
    });

    await todo.save();
    return {
      statusCode: 200,
      body: "todo created successfully",
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: "error at creating new todo",
    };
  }
};
