const UserPosts = require("../models/userPosts.model"); // Update the path to the actual location of your UserPosts model
const { fetchAndUpdateSpecificCounter } = require("../utils/counterUtil");// Update the path to the actual counter utility
const searchAndFilter = require("../utils/searchAndFilterUtil");
const queryUtils = require('../utils/queryUtils');

exports.findAll = async (req, res) => {
  try {
    const userPosts = await queryUtils.paginateAndFilter(UserPosts, req);
    res.json(userPosts);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving userPosts."
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

    const userPost = await UserPosts.findOne(filter, fields);

    if (!userPost) {
      return res.status(404).send({ message: "UserPost not found" });
    }
    res.json(userPost);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error retrieving user post ",
    });
  }
};

// Create a new event
exports.create = async (req, res) => {
  try {
    const userPostsCounter = await fetchAndUpdateSpecificCounter(
      "postCounter",
      "userPostIdCounter"
    );
    console.log(req.body);
    const newUserPost = new UserPosts({
      ...req.body,
      table_id: userPostsCounter,
      is_deleted: false,
      created_by: req.body.created_by,
      cdate_time: new Date().toISOString(),
    });

    const savedUserPost = await newUserPost.save();
    res.status(201).send(savedUserPost);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while creating the user post.",
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

    const updatedUserPost = await UserPosts.findOneAndUpdate(
      { table_id: req.params.id },
      updateFields,
      { new: true }
    );

    if (!updatedUserPost) {
      return res.status(404).send({ message: "UserPosts not found" });
    }
    res.send(updatedUserPost);
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

    const userPost = await UserPosts.findOneAndUpdate(
      { post_id: req.params.id },
      updateData,
      { new: true }
    );

    if (!userPost) {
      return res.status(404).send({ message: "UserPosts not found" });
    }
    res.send({ message: "UserPosts was deleted successfully!" });
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Could not delete user post with id " + req.params.id,
    });
  }
};

exports.findBySearchAndFilter = async (req, res) => {
  const response = await searchAndFilter(UserPosts, req);
  if (response.success) {
    res.status(200).json(response);
  } else {
    res.status(500).json(response);
  }
};
