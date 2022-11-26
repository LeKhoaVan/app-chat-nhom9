const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    birthday: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    avt:{
      type: String
    },
    status:{
      type: Number,
    },
    isActive:{
      type: Boolean,
    },
    friends: {
      type: Array,
    },
    sendFrs: {
      type: Array,
    },
    receiveFrs: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", UserSchema);
