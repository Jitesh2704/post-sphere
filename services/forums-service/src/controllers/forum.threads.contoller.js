const db = require("../models");
const ForumThreads = db.forumThreads;
const {fetchAndUpdateSpecificCounter} = require("../utils/counterUtil");
const queryUtils = require('../utils/queryUtils');

exports.findAll = async (req, res) => {
  try {
    const threads = await queryUtils.paginateAndFilter(ForumThreads, req);
    res.json(threads);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving threads."
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

    const forumThread = await ForumThreads.findOne(filter, fields);

    if (!forumThread) {
      return res.status(404).send({ message: "Forum thread not found" });
    }
    res.json(forumThread);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error retrieving forum thread ",
    });
  }
};

// Create a new expert program
exports.create = async (req, res) => {
  try {
    const forumThreadsCounter = await fetchAndUpdateSpecificCounter(
      "forumCounter",
      "forumsThreadIdCounter"
    );
    const newForumThread = new ForumThreads({
      ...req.body,
      thread_id: forumThreadsCounter,
      is_deleted: false,
      created_by: req.body.created_by,
      cdate_time: new Date().toISOString(),
    });

    const savedForumThread = await newForumThread.save();
    res.status(201).send(savedForumThread);
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message:
        error.message || "Some error occurred while creating the forum thread.",
    });
  }
};

// Update an existing expert program
exports.update = async (req, res) => {
  try {
    const updateFields = {
      ...req.body,
      modified_by: req.body.modified_by,
      mdate_time: new Date().toISOString(),
    };

    const updatedForumThreads = await ForumThreads.findOneAndUpdate(
      { thread_id: req.params.id },
      updateFields,
      { new: true }
    );

    if (!updatedForumThreads) {
      return res.status(404).send({ message: "Forum not found" });
    }
    res.send(updatedForumThreads);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Error updating forum thread ",
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

    const forumThread = await ForumThreads.findOneAndUpdate(
      { thread_id: req.params.id },
      updateData,
      { new: true }
    );

    if (!forumThread) {
      return res.status(404).send({ message: "forum thread not found" });
    }
    res.send({ message: "forum thread was deleted successfully!" });
  } catch (error) {
    res.status(500).send({
      message:
        error.message ||
        "Could not delete forum thread with id " + req.params.id,
    });
  }
};
