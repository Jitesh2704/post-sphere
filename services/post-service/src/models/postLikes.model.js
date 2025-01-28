const mongoose = require("mongoose");
const { Schema } = mongoose;

const postLikesSchema = new Schema({
  post_like_id: {
    type: Number,
    unique: true,
  },
  user_id: {
    type: Number,
  },
  post_id: {
    type: Number,
  },
  is_liked: {
    type: Boolean,
    default: false,
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

// const PostLikes = mongoose.model();

module.exports = mongoose.model("PostLikes", postLikesSchema);
