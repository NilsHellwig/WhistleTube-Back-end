require("dotenv").config();
require("./config/database").connect();
const User = require("./model/user");
const TubeRepository = require("./model/TubeRepository");
const express = require("express");
const authRoutes = require("./auth_routes");
const tubeRoutes = require("./tube_routes");
var cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// importing user context

authRoutes(app, User);
tubeRoutes(app);

module.exports = app;

/* Database Testing */

/*
TubeRepository.create({
  tube_id: "main",
  title: "Hauptkanal",
  messages: [],
});
*/

/*
TubeRepository.findOneAndUpdate(
    { tube_id: "main" }, 
    { $push: { "messages": {text: "Test Nachricht.", username: "nchellwig"}}}, {new: true}, (err, result) => {}
);
*/

/*
TubeRepository.exists({tube_id: "tree"}).then((doc) => {
    console.log(doc);
});
*/



