const Collection = require("../models/Collection");
const Todo = require("../models/Todo");
const connectToDB = require("./db");

module.exports = updateCount = async (collection) => {
  await connectToDB();
  try {
    const count = await Todo.count({ group: collection._id });
    await Collection.findByIdAndUpdate(
      { _id: collection._id },
      { count: count }
    );
    collection.count = count;
    return collection;
  } catch (error) {
    return error;
  }
};
