const mongoose = require("mongoose");

const CollectionSchema = new mongoose.Schema({
  name: String,
  count: Number,
});

module.exports = mongoose.model("Collection", CollectionSchema);
