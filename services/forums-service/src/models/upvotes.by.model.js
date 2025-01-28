const mongoose = require("mongoose");

const UpvotesSchema = new mongoose.Schema({
  table_id: Number,
  is_thread: Boolean,
  thread_id: Number,
  forum_id: Number,
  reply_id: Number,
  user_id: Number,
  upvote_type: {
    type: String,
    default: "upvote"
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  deleted_by: {
    type: Number,
    default: null,
  },
  modified_by: {
    type: Number,
    default: null,
  },
  mdate_time: Date,
  ddate_time: Date,
  created_by: {
    type: Number,
    default: null,
  },
  cdate_time: Date,
});

module.exports = mongoose.model("Upvotes", UpvotesSchema);
