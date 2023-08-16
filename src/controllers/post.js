const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const _ = require("lodash");

const Post = require("../model/Post");
const {
  validatePostRequest,
  validateRequestIdParam,
} = require("../utils/validation");
const User = require("../model/User");
const { throwError } = require("../utils/error");
const { response } = require("express");

exports.postPost = async (req, res, next) => {
  try {
    validatePostRequest(req);

    const title = req.body.title;
    const description = req.body.description;

    const post = new Post({
      title: title,
      description: description,
      creator: req.userId,
      userLikes: [],
      comments: [],
    });

    const createdPost = await post.save();

    const user = await User.findById(req.userId);

    if (!user) {
      throwError("User doesn't exists", 404);
    }

    user.posts.push(createdPost);
    await user.save();

    const response = {
      "Post-ID": createdPost._id,
      Title: createdPost.title,
      Description: createdPost.description,
      "Created Time": createdPost.createdAt,
    };

    res.status(201).json(response);

    return response;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    validateRequestIdParam(req);

    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      throwError("Invalid URL", 404);
    }

    if (post.creator.toString() !== req.userId) {
      throwError("Unauthorized", 401);
    }

    const user = await User.findById(req.userId);

    if (!user) {
      throwError("User doesn't exists", 404);
    }

    user.posts = [...user.posts.filter((p) => p.toString() !== postId)];
    user.save();

    await Post.deleteOne({ _id: postId });
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    validateRequestIdParam(req);

    const postId = req.params.id;
    const post = await Post.findById(postId).populate("comments");

    if (!post) {
      throwError("Invalid URL", 404);
    }

    const comments = post.comments.map((cmt) => cmt.comment);

    res.status(200).json({
      id: post._id,
      title: post.title,
      description: post.description,
      creator: post.creator,
      likes: post.userLikes.length,
      comments: comments,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getAllPosts = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (errors && !errors.isEmpty()) {
      throwError("Validation failed", 422, errors);
    }

    const user = await User.findById(req.userId).populate({
      path: "posts",
      populate: { path: "comments" },
    });

    if (!user) {
      throwError("User doesn't exists", 404);
    }

    const posts_sorted = _.sortBy(user.posts, (post) => post.createdAt);

    const posts = posts_sorted.map((post) => {
      return {
        id: post._id,
        title: post.title,
        desc: post.description,
        created_at: post.createdAt,
        likes: post.userLikes.length,
        comments: post.comments.map((cmt) => cmt.comment),
      };
    });

    res.status(200).json({ posts: posts });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.likePost = async (req, res, next) => {
  try {
    validateRequestIdParam(req);

    const user = await User.findById(req.userId);

    if (!user) {
      throwError("User doesn't exists", 404);
    }

    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      throwError("Invalid URL", 404);
    }

    if (post.creator.toString() === req.userId) {
      throwError("can't like post created by you", 401);
    }

    if (post.userLikes.includes(req.userId)) {
      throwError("Already liked", 409);
    }

    post.userLikes.push(req.userId);
    await post.save();

    res.status(200).json({ message: "Post liked successfully" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.unlikePost = async (req, res, next) => {
  try {
    validateRequestIdParam(req);

    const user = await User.findById(req.userId).populate({
      path: "posts",
      populate: { path: "comments" },
    });

    if (!user) {
      throwError("User doesn't exists", 404);
    }

    const postId = req.params.id;
    const post = await Post.findById(postId).populate("comments");

    if (!post) {
      throwError("Invalid URL", 404);
    }

    if (post.creator.toString() === req.userId) {
      throwError("can't unlike post created by you", 401);
    }

    if (!post.userLikes.includes(req.userId)) {
      throwError("Not liked", 409);
    }

    post.userLikes = [
      ...post.userLikes.filter((id) => id.toString() !== req.userId),
    ];
    await post.save();

    res.status(200).json({ message: "Post unliked successfully" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
