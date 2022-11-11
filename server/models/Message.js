const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    sender: {
      type: String,
    },
    type: {
      type: Number,
    },
    text: {
      type: String,
    },
    reCall: {
      type: Boolean,
    },
    delUser: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
