const mongoose = require("mongoose");

const tubeRepositorySchema = new mongoose.Schema({
  tube_id: { type: String, unique: true },
  title: { type: String, default: "Neuer Tube" },
  messages: [{text: String, username: String}]
});

module.exports = mongoose.model("TubeRepository", tubeRepositorySchema);