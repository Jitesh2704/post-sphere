const express = require("express");
const router = express.Router();
const forumController = require("../controllers/forums.controller"); // Update the path as per your directory structure

// Define the routes for the Expert Program entity
router.get("/getAllForums", forumController.findAll);
router.get("/getForum", forumController.findOne);
router.post("/createForum", forumController.create);
router.put("/updateForum", forumController.update);
router.delete("/deleteForum/:id/:deleted_by", forumController.delete);

module.exports = router;
