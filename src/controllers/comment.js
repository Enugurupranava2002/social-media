const Post = require("../model/Post");
const User = require("../model/User");
const Comment = require("../model/Comment");
const { validateCommentRequest } = require("../utils/validation");
const { throwError } = require("../utils/error");

exports.postComment = async (req, res, next) => {
  try {
    const errors = validateCommentRequest(req);

    if (errors && !errors.isEmpty()) {
      throwError("Validation failed", 422, errors);
    }

    const { id: postId } = req.params;
    const { comment } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      throwError("User not found", 404, errors);
    }

    const post = await Post.findById(postId);

    if (!post) {
      throwError("Post not found", 404, errors);
    }

    const newComment = new Comment({
      comment: comment,
      userId: req.userId,
      postId: postId,
    });

    post.comments.push(newComment._id);

    await post.save();
    await newComment.save();

    const response = { "Comment-ID": newComment._id };
    res.status(201).json(response);

    return response;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
