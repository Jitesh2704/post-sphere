const UserCollections = require("../models/userCollections.model"); // Update the path to the actual location of your UserCollections model
const { fetchAndUpdateSpecificCounter } = require("../utils/counterUtil"); // Update the path to the actual counter utility
const searchAndFilter = require("../utils/searchAndFilterUtil");
const queryUtils = require('../utils/queryUtils');

exports.findAll = async (req, res) => {
  try {
    const collections = await queryUtils.paginateAndFilter(UserCollections, req);
    res.json(collections);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving collections."
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

    const userCollection = await UserCollections.findOne(filter, fields);

    if (!userCollection) {
      return res.status(404).send({ message: "User Collection not found" });
    }
    res.json(userCollection);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error retrieving user collection",
    });
  }
};

// Create a new event
exports.create = async (req, res) => {
  try {
    const userCollectionsCounter = await fetchAndUpdateSpecificCounter(
      "postCounter",
      "userCollectionIdCounter"
    );
    console.log(req.body);
    const newUserCollection = new UserCollections({
      ...req.body,
      collection_id: userCollectionsCounter,
      is_deleted: false,
      created_by: req.body.created_by,
      cdate_time: new Date().toISOString(),
    });

    const savedUserCollection = await newUserCollection.save();
    res.status(201).send(savedUserCollection);
  } catch (error) {
    res.status(500).send({
      message:
        error.message ||
        "Some error occurred while creating the user collection.",
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

    const updatedUserCollection = await UserCollections.findOneAndUpdate(
      { collection_id: req.params.id },
      updateFields,
      { new: true }
    );

    if (!updatedUserCollection) {
      return res.status(404).send({ message: "UserCollections not found" });
    }
    res.send(updatedUserCollection);
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

    const userCollection = await UserCollections.findOneAndUpdate(
      { collection_id: req.params.id },
      updateData,
      { new: true }
    );

    if (!userCollection) {
      return res.status(404).send({ message: "UserCollection not found" });
    }
    res.send({ message: "UserCollection was deleted successfully!" });
  } catch (error) {
    res.status(500).send({
      message:
        error.message ||
        "Could not delete user collection with id " + req.params.id,
    });
  }
};

exports.findBySearchAndFilter = async (req, res) => {
  const response = await searchAndFilter(UserCollections, req);
  if (response.success) {
    res.status(200).json(response);
  } else {
    res.status(500).json(response);
  }
};
