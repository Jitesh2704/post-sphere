const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

// Counter model
db.counter = require("./counter.model"); // Adjust the path as per your directory structure

db.forums = require("./forums.model");
db.forumThreads = require("./forum.threads.model");
db.upvotes = require("./upvotes.by.model");
db.threadReplies = require("./thread.replies");

module.exports = db;
