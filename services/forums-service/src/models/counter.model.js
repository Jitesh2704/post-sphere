const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema({
  identifier: { type: String, required: true },
  forumIdCounter: { type: Number, default: 0 },
  forumsThreadIdCounter: { type: Number, default: 0 },
  upvotesIdCounter: { type: Number, default: 0 },
  threadRepliesIdCounter: { type: Number, default: 0 },
});

module.exports = mongoose.model("Counter", CounterSchema);
