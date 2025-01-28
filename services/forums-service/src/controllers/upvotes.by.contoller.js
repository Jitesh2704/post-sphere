const db = require("../models");
const Upvotes = db.upvotes;
const {fetchAndUpdateSpecificCounter} = require("../utils/counterUtil");
const queryUtils = require('../utils/queryUtils');

exports.findAll = async (req, res) => {
  try {
    const upvotes = await queryUtils.paginateAndFilter(Upvotes, req);
    res.json(upvotes);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving upvotes."
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
    const upvote = await Upvotes.findOne(filter, fields);

    if (!upvote) {
      return res.status(404).send({ message: "upvote not found" });
    }
    res.json(upvote);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error retrieving upvote ",
    });
  }
};

// Create a new expert program
exports.create = async (req, res) => {
  try {
    const upvoteCounter = await fetchAndUpdateSpecificCounter(
      "forumCounter",
      "upvotesIdCounter"
    );
    const newUpvote = new Upvotes({
      ...req.body,
      table_id: upvoteCounter,
      is_deleted: false,
      created_by: req.body.created_by,
      cdate_time: new Date().toISOString(),
    });

    const savedUpvote = await newUpvote.save();
    res.status(201).send(savedUpvote);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while creating the upvote.",
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

    const updatedUpvotes = await Upvotes.findOneAndUpdate(
      { table_id: req.params.id },
      updateFields,
      { new: true }
    );

    if (!updatedUpvotes) {
      return res.status(404).send({ message: "upvote not found" });
    }
    res.send(updatedUpvotes);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Error updating upvote with id " + req.params.id,
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

    const upvote = await Upvotes.findOneAndUpdate(
      { table_id: req.params.id },
      updateData,
      { new: true }
    );

    if (!upvote) {
      return res.status(404).send({ message: "upvote not found" });
    }
    res.send({ message: "upvote was deleted successfully!" });
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Could not delete upvote with id " + req.params.id,
    });
  }
};
