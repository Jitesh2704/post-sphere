const express = require("express");
const router = express.Router();
const userCollectionsController = require("../controllers/userCollections.controller");

// Define the routes for the Event entity
router.get("/getAllUserCollections", userCollectionsController.findAll);
router.get("/getUserCollection", userCollectionsController.findOne);
router.get("/searchUserCollections", userCollectionsController.findBySearchAndFilter);
router.post("/createUserCollection", userCollectionsController.create);
router.put("/updateUserCollection/:id", userCollectionsController.update);
router.delete("/deleteUserCollection/:id/:deleted_by", userCollectionsController.delete);

module.exports = router;
