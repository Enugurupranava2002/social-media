const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: Schema.Types.String,
      required: true, // this field is required
      trim: true, // removes whitespace from beginning and end of string
      minLength: 5, // title must be at least 5 characters long
    },
    description: {
      type: Schema.Types.String,
      required: true,
      trim: true, // removes whitespace from beginning and end of string
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User", // this refers to the User model
      required: true,
    },
    userLikes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User", // this refers to the User model
        required: true,
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment", // this refers to the Comment model
        required: true,
      },
    ],
  },
  {
    versionKey: false, // removes __v property from collection
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" }, // automatically adds createdAt and updatedAt properties to collection
  }
);

module.exports = mongoose.model("Post", postSchema);
