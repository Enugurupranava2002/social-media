const expect = require("chai").expect;
const { mongoose } = require("mongoose");

const User = require("../src/model/User");
const keys = require("./keys");
const Post = require("../src/model/Post");
const FollowUnfollowController = require("../src/controllers/post");

describe("Like-Unlike Post Controller", function () {
  before(function (done) {
    mongoose
      .connect(keys["mongodb-test-connection-string"])
      .then((result) => {
        const user1 = new User({
          email: "test@gmail.com",
          password: "test@123",
          followings: [],
          followers: [],
          posts: [],
          _id: "5c0f66b979af55031b34728a",
        });
        const user2 = new User({
          email: "test1@gmail.com",
          password: "test@123",
          followings: [],
          followers: [],
          posts: [],
          _id: "5c0f66b979af55031b34728b",
        });
        const post = new Post({
          title: "test post",
          description: "test post description",
          _id: "5c0f66b979af55031b34728c",
          creator: "5c0f66b979af55031b34728a",
          userLikes: [],
          comments: [],
        });
        return Promise.all([user1.save(), user2.save(), post.save()]);
      })
      .then(() => {
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
  });

  it("should increase likes count to 1 of post(5c0f66b979af55031b34728c) when user(5c0f66b979af55031b34728b) likes it", function (done) {
    const req = {
      userId: "5c0f66b979af55031b34728b",
      params: { id: "5c0f66b979af55031b34728c" },
    };

    const res = {
      status: function () {
        return this;
      },
      json: function () {},
    };

    FollowUnfollowController.likePost(req, res, () => {})
      .then(() => {
        return Post.findById("5c0f66b979af55031b34728c");
      })
      .then((post) => {
        expect(post.userLikes).to.have.length(1);
        done();
      })
      .catch((err) => {
        console.log(err);
        done(new Error("Error occured in like post test case"));
      });
  });

  it("should decrease likes count to 0 of post(5c0f66b979af55031b34728c) when user(5c0f66b979af55031b34728b) unlikes it", function (done) {
    const req = {
      userId: "5c0f66b979af55031b34728b",
      params: { id: "5c0f66b979af55031b34728c" },
    };

    const res = {
      status: function () {
        return this;
      },
      json: function () {},
    };

    FollowUnfollowController.unlikePost(req, res, () => {})
      .then(() => {
        return Post.findById("5c0f66b979af55031b34728c");
      })
      .then((post) => {
        expect(post.userLikes).to.have.length(0);
        done();
      })
      .catch((err) => {
        console.log(err);
        done(new Error("Error occured in unlike post test case"));
      });
  });

  after(function (done) {
    User.deleteMany({})
      .then(() => {
        return Post.deleteMany({});
      })
      .then(() => {
        mongoose.disconnect();
      })
      .then(() => {
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
  });
});
