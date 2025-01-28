const mongoose = require("mongoose");

const ThreadRepliesSchema = new mongoose.Schema({
  thread_id: Number,
  forum_id: Number,
  reply_id: Number,
  reply_content: String,
  no_of_upvotes: {
    type: Number,
    default: 0
  },
  no_of_downvotes: {
    type: Number,
    default: 0
  },
  // Id of the reply to which this reply is replying
  reply_to: {
    type: Number,
    default: null
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

ThreadRepliesSchema.index({ cdate_time: -1 });

module.exports = mongoose.model("ThreadReplies", ThreadRepliesSchema);
