const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    otp: {
      type: String,
    },
    time: {
        type: Date,
        default:  Date.now(),
        index: {expires: 300}
    }
  }
  
);

module.exports = mongoose.model("otps", OtpSchema);
