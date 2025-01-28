const express = require("express");
const router = express.Router();
const forumThreadsController = require("../controllers/forum.threads.contoller"); // Update the path as per your directory structure

// Define the routes for the Expert Program entity
router.get("/getAllForumThreads", forumThreadsController.findAll);
router.get("/getForumThread", forumThreadsController.findOne);
router.post("/createForumThread", forumThreadsController.create);
router.put("/updateForumThread/:id", forumThreadsController.update);
router.delete("/deleteForumThread/:id/:deleted_by", forumThreadsController.delete);

module.exports = router;
