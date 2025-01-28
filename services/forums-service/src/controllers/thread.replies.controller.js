const db = require("../models");
const ThreadReplies = db.threadReplies;
const {fetchAndUpdateSpecificCounter} = require("../utils/counterUtil");
const queryUtils = require('../utils/queryUtils');

exports.findAll = async (req, res) => {
  try {
    const replies = await queryUtils.paginateAndFilter(ThreadReplies, req);
    res.json(replies);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving replies."
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

    const reply = await ThreadReplies.findOne(filter, fields);

    if (!reply) {
      return res.status(404).send({ message: "Reply  not found" });
    }
    res.json(reply);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error retrieving Reply ",
    });
  }
};

// Create a new expert program
exports.create = async (req, res) => {
  try {
    const replyCounter = await fetchAndUpdateSpecificCounter(
      "forumCounter",
      "threadRepliesIdCounter"
    );
    const newReply = new ThreadReplies({
      ...req.body,
      reply_id: replyCounter,
      is_deleted: false,
      created_by: req.body.created_by,
      cdate_time: new Date().toISOString(),
    });

    const savedReply = await newReply.save();
    res.status(201).send(savedReply);
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: error.message || "Some error occurred while creating the Reply.",
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

    const updatedReplies = await ThreadReplies.findOneAndUpdate(
      { reply_id: req.params.id },
      updateFields,
      { new: true }
    );

    if (!updatedReplies) {
      return res.status(404).send({ message: "Reply not found" });
    }
    res.send(updatedReplies);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error updating Reply with id " + req.params.id,
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

    const reply = await ThreadReplies.findOneAndUpdate(
      { reply_id: req.params.id },
      updateData,
      { new: true }
    );

    if (!reply) {
      return res.status(404).send({ message: "Reply not found" });
    }
    res.send({ message: "Reply was deleted successfully!" });
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Could not delete Reply with id " + req.params.id,
    });
  }
};

exports.findHowMany = async (req, res) => {
  try {
    // Build filter for querying based on any filter fields provided in the request
    const filter = {is_deleted: false};
    const filterFields = req.query.filterFields
      ? JSON.parse(req.query.filterFields)
      : {};

    // Add filterFields to the filter if they exist
    Object.keys(filterFields).forEach((key) => {
      filter[key] = filterFields[key];
    });

    // Count the total number of documents matching the filter
    const totalDocuments = await ThreadReplies.countDocuments(filter);

    // Respond with the total number of documents only
    res.json({ totalDocuments, thread_id : filterFields?.thread_id });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving Replies.",
    });
  }
};