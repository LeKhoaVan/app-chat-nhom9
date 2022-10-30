const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    avt:{
      type: String
    },
    name: {
      type: String
    },
    members: {
      type: Array,
    },
    authorization: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
