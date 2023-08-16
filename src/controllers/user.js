const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const User = require("../model/User");
const {
  validateAuthRequest,
  validateRequestIdParam,
} = require("../utils/validation");
const { throwError } = require("../utils/error");

const registerUser = (email, password) => {
  return bcrypt.hash(password, 12).then((hashedPassword) => {
    const user = new User({
      email: email,
      password: hashedPassword,
      followers: [],
      followings: [],
      posts: [],
    });
    return user.save();
  });
};

exports.authenticate = async (req, res, next) => {
  try {
    const errors = validateAuthRequest(req);

    if (errors && !errors.isEmpty()) {
      throwError("Validation failed", 422, errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    let loadedUser;
    const foundUser = await User.findOne({ email: email });
    if (!foundUser) {
      loadedUser = await registerUser(email, password);
    } else {
      loadedUser = foundUser;
    }

    const isEqual = await bcrypt.compare(password, loadedUser.password);

    if (!isEqual) {
      throwError("Wrong password", 401);
    }

    const token = jwt.sign(
      { userId: loadedUser._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );

    res.status(200).json({ token: token });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (errors && !errors.isEmpty()) {
      throwError("Validation failed", 422, errors);
    }

    const foundUser = await User.findById(req.userId);
    if (!foundUser) {
      throwError("User not found", 404, errors);
    }

    res.status(200).json({
      username: foundUser.email,
      followers: foundUser.followers.length,
      followings: foundUser.followings.length,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.followUser = async (req, res, next) => {
  try {
    validateRequestIdParam(req);

    // current logged-in user follows the user with id req.params.id
    const followingUserId = req.params.id;
    const currentUserId = req.userId;

    if (followingUserId === currentUserId) {
      throwError("You cannot follow yourself", 403);
    }

    const followingUser = await User.findById(followingUserId);
    if (!followingUser) {
      throwError("Following User not found", 404);
    }

    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      throwError("Current User not found", 404);
    }

    // check if current user is already following the user
    if (currentUser.followings.includes(followingUserId)) {
      throwError("You already following", 403);
    }

    // check if current user is already in followers of the following user
    if (followingUser.followers.includes(currentUserId)) {
      throwError("You already following", 403);
    }

    // add the following user to the current user's following list
    currentUser.followings.push(followingUserId);
    await currentUser.save();

    // add the current user to the following user's followers list
    followingUser.followers.push(currentUserId);
    await followingUser.save();

    res.status(200).json({ message: "Followed successfully" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.unfollowUser = async (req, res, next) => {
  try {
    validateRequestIdParam(req);

    // current logged-in user unfollows the user with id req.params.id
    const followingUserId = req.params.id;
    const currentUserId = req.userId;

    if (followingUserId === currentUserId) {
      throwError("You cannot unfollow yourself", 403);
    }

    const followingUser = await User.findById(followingUserId);
    if (!followingUser) {
      throwError("Following User not found", 404);
    }

    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      throwError("Current User not found", 404);
    }

    // check if current user is not following the user
    if (!currentUser.followings.includes(followingUserId)) {
      throwError("You are not following", 403);
    }

    // check if current user is not in followers of the following user
    if (!followingUser.followers.includes(currentUserId)) {
      throwError("You are not following", 403);
    }

    // remove the following user from the current user's following list
    currentUser.followings = currentUser.followings.filter(
      (user) => user.toString() !== followingUserId
    );
    await currentUser.save();

    // remove the current user from the following user's followers list
    followingUser.followers = followingUser.followers.filter(
      (user) => user.toString() !== currentUserId
    );
    await followingUser.save();

    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
