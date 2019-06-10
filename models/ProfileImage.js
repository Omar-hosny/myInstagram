const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create schema

const ProfileImageSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = ProfileImage = mongoose.model(
  "profileImage",
  ProfileImageSchema
);
