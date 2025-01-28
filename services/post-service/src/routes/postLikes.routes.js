const express = require("express");
const router = express.Router();
const postLikesController = require("../controllers/postLikes.controller");

// Define the routes for the Event entity
router.get("/getAllPostLikes", postLikesController.findAll);
router.get("/getPostLike", postLikesController.findOne);
router.get("/searchPostLikes", postLikesController.findBySearchAndFilter);
router.get("/getLikeCount/:postId", postLikesController.getLikeCountForPost);
router.post("/createPostLike", postLikesController.create);
router.put("/updatePostLike/:id", postLikesController.update);
router.delete("/deletePostLike/:id/:deleted_by", postLikesController.delete);

module.exports = router;
