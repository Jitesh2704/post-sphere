const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema({
  identifier: { type: String, required: true },
  post_counter: { type: Number, default: 0 },
  postLikeIdCounter: { type: Number, default: 0 },
  userCollectionIdCounter: { type: Number, default: 0 },
  userPostIdCounter: { type: Number, default: 0 },
});

module.exports = mongoose.model("Counter", CounterSchema);
