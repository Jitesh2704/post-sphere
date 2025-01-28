const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

// Counter model
db.counter = require("./counter.model"); // Adjust the path as per your directory structure

db.post = require("./posts.model");
db.userCollection = require("./userCollections.model"); // Update path to your model file
db.userPost = require("./userPosts.model"); // Update path to your model file
db.postLike = require("./postLikes.model"); // Update path to your model file

module.exports = db;
