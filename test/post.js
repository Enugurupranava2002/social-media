const expect = require("chai").expect;
const { mongoose } = require("mongoose");

const User = require("../src/model/User");
const PostController = require("../src/controllers/post");

const keys = require("./keys");
const Post = require("../src/model/Post");

describe("Post Controllers", function () {
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

  it("should add a created post to posts of creator", function (done) {
    const req = {
      body: {
        title: "test post",
        description: "test post description",
      },
      userId: "5c0f66b979af55031b34728a",
    };

    const res = {
      status: function () {
        return this;
      },
      json: function () {},
    };

    PostController.postPost(req, res, () => {})
      .then((result) => {
        expect(result).to.have.property("Post-ID");
        expect(result).to.have.property("Title", "test post");
        expect(result).to.have.property("Description", "test post description");
        expect(result).to.have.property("Created Time");
        done();
      })
      .catch((err) => {
        console.log(err);
        done(new Error("Error in adding post to posts of creator"));
      });
  });

  it("should throw an error if request body doesn't contain title field while creating post", function (done) {
    const req = {
      body: {
        description: "test post description",
      },
      userId: "5c0f66b979af55031b34728a",
    };

    const res = {
      status: function () {
        return this;
      },
      json: function () {},
    };

    let message;
    let statusCode;

    const catchError = (e) => {
      message = e.message;
      statusCode = e.statusCode;
      return;
    };

    PostController.postPost(req, res, catchError)
      .then(() => {
        return User.findById("5c0f66b979af55031b34728a");
      })
      .then((user) => {
        expect(message).to.be.equal("Title is required");
        expect(statusCode).to.be.equal(422);
        done();
        expect(user.posts).to.have.length(1);
      })
      .catch((err) => {
        console.log(err);
        done(new Error("Error in adding post to posts of creator"));
      });
  });

  it("should delete post from post collection and from creator's posts array", function (done) {
    Post.findOne({ title: "test post" })
      .then((post) => {
        const req = {
          params: {
            id: post._id.toString(),
          },
          userId: "5c0f66b979af55031b34728a",
        };

        PostController.deletePost(req, {}, () => {}).then(() => {
          Post.findOne({ title: "test post" })
            .then((post) => {
              expect(post).to.be.null;
              return User.findById("5c0f66b979af55031b34728a");
            })
            .then((user) => {
              expect(user.posts).to.have.length(0);
              done();
            });
        });
      })
      .catch((err) => {
        console.log(err);
        done(new Error("Error in deleting post from post collection"));
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
