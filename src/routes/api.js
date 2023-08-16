const express = require("express");

const {
  authenticate,
  loginUser,
  followUser,
  unfollowUser,
} = require("../controllers/user");
const PostRoutes = require("./post");
const { auth } = require("../utils/auth");
const { getAllPosts, likePost, unlikePost } = require("../controllers/post");
const { postComment } = require("../controllers/comment");

const router = express.Router();

router.post("/authenticate", authenticate);

router.get("/user", auth, loginUser);

router.post("/follow/:id", auth, followUser);

router.post("/unfollow/:id", auth, unfollowUser);

router.use("/posts", PostRoutes);

router.get("/all_posts", auth, getAllPosts);

router.post("/comment/:id", auth, postComment);

router.post("/like/:id", auth, likePost);

router.post("/unlike/:id", auth, unlikePost);

router.use((error, req, res, next) => {
  console.log(error);
  const message = error.message;
  const data = error.data;
  res.status(error.statusCode).json({ message: message, data: data });
});

module.exports = router;
