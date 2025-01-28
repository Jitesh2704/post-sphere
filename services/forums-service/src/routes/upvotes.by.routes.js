const express = require("express");
const router = express.Router();
const upvoteByController = require("../controllers/upvotes.by.contoller"); // Update the path as per your directory structure

// Define the routes for the Expert Program entity
router.get("/getAllUpvotes", upvoteByController.findAll);
router.get("/getUpvote", upvoteByController.findOne);
router.post("/createUpvote", upvoteByController.create);
router.put("/updateUpvote", upvoteByController.update);
router.delete("/deleteUpvote/:id/:deleted_by", upvoteByController.delete);

module.exports = router;
