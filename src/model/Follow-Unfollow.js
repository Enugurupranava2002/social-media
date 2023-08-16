const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const followUnfollowSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Post", // this is the name of the model to which this field refers
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);
