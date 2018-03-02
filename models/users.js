var mongoose = require("mongoose");

// user schema
var userSchema = new mongoose.Schema({
  email: String,
  name: String,
  goodthings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goodthing"
    }
  ]
});
var User = mongoose.model("User", userSchema);
module.exports = User