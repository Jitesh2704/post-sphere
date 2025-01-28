const mongoose = require("mongoose");
const { Schema } = mongoose;

const userPostsSchema = new Schema({
  table_id: {
    type: Number,
    unique: true,
  },
  user_id: {
    type: Number,
  },
  post_id: {
    type: Number,
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

// const UserPosts = mongoose.model();

module.exports = mongoose.model("UserPosts", userPostsSchema);
