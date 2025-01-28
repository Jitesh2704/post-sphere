const PostLikes = require("../models/postLikes.model"); // Update the path to the actual location of your PostLikes model
const { fetchAndUpdateSpecificCounter } = require("../utils/counterUtil");// Update the path to the actual counter utility
const searchAndFilter = require("../utils/searchAndFilterUtil");
const queryUtils = require('../utils/queryUtils');

exports.findAll = async (req, res) => {
  try {
    const likes = await queryUtils.paginateAndFilter(PostLikes, req);
    res.json(likes);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving likes."
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

    const postLike = await PostLikes.findOne(filter, fields);

    if (!postLike) {
      return res.status(404).send({ message: "post like not found" });
    }
    res.json(postLike);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error retrieving post like",
    });
  }
};

// Create a new event
exports.create = async (req, res) => {
  try {
    const postLikesCounter = await fetchAndUpdateSpecificCounter(
      "postCounter",
      "postLikeIdCounter"
    );
    console.log(req.body);
    const newPostLike = new PostLikes({
      ...req.body,
      post_like_id: postLikesCounter,
      is_deleted: false,
      created_by: req.body.created_by,
      cdate_time: new Date().toISOString(),
    });

    const savedPostLike = await newPostLike.save();
    res.status(201).send(savedPostLike);
  } catch (error) {
    res.status(500).send({
      message:
        error.message ||
        "Some error occurred while creating the post like.",
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

    const updatedPostLike = await PostLikes.findOneAndUpdate(
      { post_like_id: req.params.id },
      updateFields,
      { new: true }
    );

    if (!updatedPostLike) {
      return res.status(404).send({ message: "PostLikes not found" });
    }
    res.send(updatedPostLike);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error updating post like with id " + req.params.id,
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

    const postLike = await PostLikes.findOneAndUpdate(
      { post_like_id: req.params.id },
      updateData,
      { new: true }
    );

    if (!postLike) {
      return res.status(404).send({ message: "Post Like not found" });
    }
    res.send({ message: "Post Like was deleted successfully!" });
  } catch (error) {
    res.status(500).send({
      message:
        error.message ||
        "Could not delete post like with id " + req.params.id,
    });
  }
};

exports.findBySearchAndFilter = async (req, res) => {
  const response = await searchAndFilter(PostLikes, req);
  if (response.success) {
    res.status(200).json(response);
  } else {
    res.status(500).json(response);
  }
};


exports.getLikeCountForPost = async (req, res) => {
  try {
    const postId = req.params.postId; // Extract postId from req.params
    const likeCount = await PostLikesService.getLikeCount(postId); // Use PostLikesService to get like count
    res.json({ likeCount });
  } catch (error) {
    console.error("Error fetching like count:", error.message);
    res.status(500).json({ error: "Error fetching like count" });
  }
};
