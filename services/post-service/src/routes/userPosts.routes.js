const express = require("express");
const router = express.Router();
const userPostsController = require("../controllers/userPosts.controller");

// Define the routes for the Event entity
router.get("/getAllUserPosts", userPostsController.findAll);
router.get("/getUserPost", userPostsController.findOne);
router.get("/searchUserPosts", userPostsController.findBySearchAndFilter);
router.post("/createUserPost", userPostsController.create);
router.put("/updateUserPost/:id", userPostsController.update);
router.delete("/deleteUserPost/:id/:deleted_by", userPostsController.delete);

module.exports = router;
