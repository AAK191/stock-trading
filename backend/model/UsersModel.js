const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const UsersModel = mongoose.model("User", UsersSchema);

module.exports = { UsersModel };