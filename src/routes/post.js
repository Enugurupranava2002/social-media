const express = require("express");
const {
  postPost,
  deletePost,
  getPost,
  getAllPosts,
} = require("../controllers/post");
const { auth } = require("../utils/auth");

const router = express.Router();

router.post("/", auth, postPost);

router.delete("/:id", auth, deletePost);

router.get("/:id", auth, getPost);

router.get("/", auth);

module.exports = router;
