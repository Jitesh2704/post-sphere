const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema({
  post_id: {
    type: Number,
    unique: true,
  },
  post_type: {
    type: String,
  },
  is_draft: {
    type: Boolean,
    default: true,
  },
  post_name: {
    type: String,
    default: null,
  },
  post_img: {
    type: String,
    default: null,
  },
  is_link: {
    type: Boolean,
    default: false,
  },
  post_short_desc: {
    type: String,
    default: null,
  },
  post_author: {
    name: String,
    img: String,
    desc: String,
  },
  tags: {
    type: [String],
  },
  like_count: {
    type: Number,
    default: 0,
  },
  post_content: {
    type: Object,
    default: null,
  },
  post_forum_id: Number,
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


module.exports = mongoose.model("Posts", postSchema);