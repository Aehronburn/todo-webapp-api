const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  title: String,
  date: Date,
  author: String,
  completed: Boolean,
  group: mongoose.Types.ObjectId,
});

module.exports = mongoose.model("Todo", TodoSchema);
