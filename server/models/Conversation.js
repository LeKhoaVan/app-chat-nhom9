const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
   
    name: {
      type: String
    },
    members: {
      type: Array,
    },
    img: { 
      type: String 
    },
    authorization: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
