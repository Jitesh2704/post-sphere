const express = require("express");
const router = express.Router();
const postsController = require("../controllers/posts.controller");

// Define the routes for the Event entity
router.get("/getAllPosts", postsController.findAll);
router.get("/getPost", postsController.findOne);
router.get("/searchPosts", postsController.findBySearchAndFilter);
router.post("/createPost", postsController.create);
router.put("/updatePost/:id", postsController.update);
router.delete("/deletePost/:id/:deleted_by", postsController.delete);

module.exports = router;
