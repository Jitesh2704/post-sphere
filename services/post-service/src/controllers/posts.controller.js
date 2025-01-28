const Post = require("../models/posts.model"); // Update the path to the actual location of your Post model
const {fetchAndUpdateSpecificCounter} = require("../utils/counterUtil"); // Update the path to the actual counter utility
const searchAndFilter = require("../utils/searchAndFilterUtil");
const queryUtils = require('../utils/queryUtils');

exports.findAll = async (req, res) => {
  try {
    const posts = await queryUtils.paginateAndFilter(Post, req);
    res.json(posts);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving posts."
    });
  }
};

// Find a single event with optional field selection
exports.findOne = async (req, res) => {
  try {
    const fields = req.query.fields
      ? req.query.fields.split(",").join(" ")
      : "";

    // Build filter for querying
    const filter = { is_deleted: false };
    const filterFields = req.query.filterFields
      ? JSON.parse(req.query.filterFields)
      : {};

    // Add filterFields to the filter if they exist
    Object.keys(filterFields).forEach((key) => {
      filter[key] = filterFields[key];
    });

    const post = await Post.findOne(filter, fields);

    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error retrieving post ",
    });
  }
};

// Create a new event
exports.create = async (req, res) => {
  try {
    const postCounter = await fetchAndUpdateSpecificCounter(
      "postCounter",
      "post_counter"
    );
    console.log(req.body);
    const newPost = new Post({
      ...req.body,
      post_id: postCounter,
      is_deleted: false,
      created_by: req.body.created_by,
      cdate_time: new Date().toISOString(),
    });

    const savedPost = await newPost.save();
    res.status(201).send(savedPost);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while creating the post.",
    });
  }
};

// Update an existing event
exports.update = async (req, res) => {
  try {
    const updateFields = {
      ...req.body,
      modified_by: req.params.id,
      mdate_time: new Date().toISOString(),
    };

    const updatedPost = await Post.findOneAndUpdate(
      { post_id: req.params.id },
      updateFields,
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).send({ message: "Post not found" });
    }
    res.send(updatedPost);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error updating post with id " + req.params.id,
    });
  }
};

// Delete an event (mark as deleted)
exports.delete = async (req, res) => {
  try {
    const updateData = {
      is_deleted: true,
      deleted_by: req.params.deleted_by, // Replace with actual user ID
      ddate_time: new Date().toISOString(),
    };

    const post = await Post.findOneAndUpdate(
      { post_id: req.params.id },
      updateData,
      { new: true }
    );

    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }
    res.send({ message: "Post was deleted successfully!" });
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Could not delete post with id " + req.params.id,
    });
  }
};

exports.findBySearchAndFilter = async (req, res) => {
  const response = await searchAndFilter(Post, req);
  if (response.success) {
    res.status(200).json(response);
  } else {
    res.status(500).json(response);
  }
};