const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    comment: {
      type: Schema.Types.String,
      required: true,
      trim: true,
    },
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

module.exports = mongoose.model("Comment", commentSchema);
