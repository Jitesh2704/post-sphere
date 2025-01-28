const db = require("../models");
const Forums = db.forums;
const {fetchAndUpdateSpecificCounter} = require("../utils/counterUtil");
const queryUtils = require('../utils/queryUtils');

exports.findAll = async (req, res) => {
  try {
    const forums = await queryUtils.paginateAndFilter(Forums, req);
    res.json(forums);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving forums."
    });
  }
};

// Find a single expert program with optional field selection
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
    const forum = await Forums.findOne(filter, fields);

    if (!forum) {
      return res.status(404).send({ message: "Forum not found" });
    }
    res.json(forum);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Error retrieving forum",
    });
  }
};

// Create a new expert program
exports.create = async (req, res) => {
  try {
    const forumCounter = await fetchAndUpdateSpecificCounter(
      "forumCounter",
      "forumIdCounter"
    );
    const newForum = new Forums({
      ...req.body,
      forum_id: forumCounter,
      is_deleted: false,
      created_by: req.body.created_by,
      cdate_time: new Date().toISOString(),
    });

    const savedForum = await newForum.save();
    res.status(201).send(savedForum);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while creating the forum.",
    });
  }
};

// Update an existing expert program
exports.update = async (req, res) => {
  try {
    const updateFields = {
      ...req.body,
      modified_by: req.body.id,
      mdate_time: new Date().toISOString(),
    };

    const updatedForum = await Forums.findOneAndUpdate(
      { forum_id: req.params.id },
      updateFields,
      { new: true }
    );

    if (!updatedForum) {
      return res.status(404).send({ message: "Forum not found" });
    }
    res.send(updatedForum);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error updating forum with id " + req.params.id,
    });
  }
};

// Delete an expert program (mark as deleted)
exports.delete = async (req, res) => {
  try {
    const updateData = {
      is_deleted: true,
      deleted_by: req.params.deleted_by, // Replace with actual user ID
      ddate_time: new Date().toISOString(),
    };

    const forum = await Forums.findOneAndUpdate(
      { forum_id: req.params.id },
      updateData,
      { new: true }
    );

    if (!forum) {
      return res.status(404).send({ message: "forum not found" });
    }
    res.send({ message: "forum was deleted successfully!" });
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Could not delete forum with id " + req.params.id,
    });
  }
};
