var mongoose = require("mongoose");

var goodthingSchema = new mongoose.Schema({
  author: String,
  memory: String,
  date: Date
});

var Goodthing = mongoose.model("Goodthing", goodthingSchema);
module.exports = Goodthing