const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: Schema.Types.String,
      required: true, // this field is required
      unique: true, // no two users can have the same email
      trim: true, // removes whitespace from beginning and end of string
      lowercase: true, // converts string to lowercase
    },
    password: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      minLength: 8, // password must be at least 10 characters long
      maxLength: 100, // password cannot be longer than 100 characters
    },
    followings: [
      {
        type: Schema.Types.ObjectId,
        ref: "User", // this refers to the User model
        required: true,
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User", // this refers to the User model
        required: true,
      },
    ],
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post", // this refers to the User model
        required: true,
      },
    ],
  },
  {
    versionKey: false, // removes __v property from collection
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" }, // automatically adds createdAt and updatedAt properties to collection
  }
);

module.exports = mongoose.model("User", userSchema);
