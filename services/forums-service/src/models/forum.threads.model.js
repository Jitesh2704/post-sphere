const mongoose = require("mongoose");

const ForumThreadsSchema = new mongoose.Schema({
  thread_id: {
    type: Number,
  },
  forum_id: Number,
  thread_topic: String,
  thread_content: String,
  no_of_upvotes: {
    type: Number,
    default: 0
  },
  thread_topic: String,
  rating_stars: {
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
  cdate_time: {
    type: Date,
    default: Date.now()
  } 
});

ForumThreadsSchema.index({ cdate_time: -1 });

module.exports = mongoose.model("ForumThreads", ForumThreadsSchema);
