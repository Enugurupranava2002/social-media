const expect = require("chai").expect;
const { mongoose } = require("mongoose");

const User = require("../src/model/User");
const keys = require("./keys");
const Post = require("../src/model/Post");
const Comment = require("../src/model/Comment");
const CommentController = require("../src/controllers/comment");

describe("Comment Controllers", function () {
  before(function (done) {
    mongoose
      .connect(keys["mongodb-test-connection-string"])
      .then((result) => {
        const user = new User({
          email: "test@gmail.com",
          password: "test@123",
          followings: [],
          followers: [],
          posts: [],
          _id: "5c0f66b979af55031b34728a",
        });

        const post = new Post({
          title: "test post",
          description: "test post description",
          _id: "5c0f66b979af55031b34728b",
          creator: "5c0f66b979af55031b34728a",
          userLikes: [],
          comments: [],
        });

        return Promise.all([user.save(), post.save()]);
      })
      .then(([user, post]) => {
        user.posts.push(post._id);
        return user.save();
      })
      .then(() => {
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
  });

  it("should add a comment to a post", function (done) {
    const req = {
      params: { id: "5c0f66b979af55031b34728b" },
      body: { comment: "test comment" },
      userId: "5c0f66b979af55031b34728a",
    };

    const res = {
      status: function () {
        return this;
      },
      json: function () {},
    };

    CommentController.postComment(req, res, () => {})
      .then((res) => {
        expect(res).to.have.property("Comment-ID");
        done();
      })
      .catch((err) => {
        console.log(err);
        done(new Error("Error occured while adding comment"));
      });
  });

  after(function (done) {
    User.deleteMany({})
      .then(() => Post.deleteMany({}))
      .then(() => Comment.deleteMany({}))
      .then(() => mongoose.disconnect())
      .then(() => {
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
  });
});
