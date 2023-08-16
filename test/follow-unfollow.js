const expect = require("chai").expect;
const { mongoose } = require("mongoose");

const User = require("../src/model/User");
const keys = require("./keys");
const Post = require("../src/model/Post");
const FollowUnfollowController = require("../src/controllers/user");

describe("Follow-Unfollow Controller", function () {
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
        return Promise.all([user1.save(), user2.save()]);
      })
      .then(() => {
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
  });

  it("should increase count of user(5c0f66b979af55031b34728a) followings to 1 and of user(5c0f66b979af55031b34728b) followers to 1 when first user follows second", function (done) {
    const req = {
      params: { id: "5c0f66b979af55031b34728b" },
      userId: "5c0f66b979af55031b34728a",
    };

    const res = {
      status: function () {
        return this;
      },
      json: function () {},
    };

    FollowUnfollowController.followUser(req, res, () => {})
      .then(() => {
        return Promise.all([
          User.findById("5c0f66b979af55031b34728a"),
          User.findById("5c0f66b979af55031b34728b"),
        ]).then(([user1, user2]) => {
          expect(user1.followings).to.have.length(1);
          expect(user2.followers).to.have.length(1);
          done();
        });
      })
      .catch((err) => {
        console.log(err);
        done(new Error("Error in followUser test"));
      });
  });

  it("should decrease count of user(5c0f66b979af55031b34728a) followings to 0 and of user(5c0f66b979af55031b34728b) followers to 0 when first user unfollows second", function (done) {
    const req = {
      params: { id: "5c0f66b979af55031b34728b" },
      userId: "5c0f66b979af55031b34728a",
    };

    const res = {
      status: function () {
        return this;
      },
      json: function () {},
    };

    FollowUnfollowController.unfollowUser(req, res, () => {})
      .then(() => {
        return Promise.all([
          User.findById("5c0f66b979af55031b34728a"),
          User.findById("5c0f66b979af55031b34728b"),
        ]).then(([user1, user2]) => {
          expect(user1.followings).to.have.length(0);
          expect(user2.followers).to.have.length(0);
          done();
        });
      })
      .catch((err) => {
        console.log(err);
        done(new Error("Error in unfollowUser test"));
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
