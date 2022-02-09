const TubeRepository = require("./model/TubeRepository");
const auth = require("./middleware/auth");

module.exports = function (app) {
  app.post("/get_tube", auth, (req, res) => {
    console.log("send!", req.body.tube_id);
    TubeRepository.find({ "tube_id": req.body.tube_id }).then((docs)  => {
        console.log({messages: docs[0].messages});
        res.status(201).json({messages: docs[0].messages});
    }).catch((err) => {
        console.log("error", err);
    });
  });
};
