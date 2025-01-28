const express = require("express");
const router = express.Router();
const threadRepliesController = require("../controllers/thread.replies.controller"); // Update the path as per your directory structure

// Define the routes for the Expert Program entity
router.get("/getAllThreadReplies", threadRepliesController.findAll);
router.get("/getThreadReply", threadRepliesController.findOne);
router.post("/createThreadReply", threadRepliesController.create);
router.put("/updateThreadReply/:id", threadRepliesController.update);
router.delete("/deleteThreadReply/:id/:deleted_by", threadRepliesController.delete);
router.get("/getNumberOfReplies", threadRepliesController.findHowMany);

module.exports = router;
