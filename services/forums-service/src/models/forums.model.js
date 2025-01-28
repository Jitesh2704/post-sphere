const mongoose = require("mongoose");

const ForumsSchema = new mongoose.Schema({
  forum_id: Number,
  forum_name: String,
  forum_rules: [
    {
      rule_content: String,
    },
  ],
  forum_type: {
    type: String,
    default: "forum"
    // "forum","rating"
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

module.exports = mongoose.model("Forums", ForumsSchema);
