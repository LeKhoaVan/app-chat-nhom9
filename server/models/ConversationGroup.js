const mongoose = require("mongoose");

const ConversationGroupSchema = new mongoose.Schema(
  {
    members: {
        type: Array,
    },
    name: {
        type: String,
    },
    authorization:{
        type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ConversationGroup", ConversationGroupSchema);
