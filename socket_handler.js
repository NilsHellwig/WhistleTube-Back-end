const socket = require("socket.io");
const TubeRepository = require("./model/TubeRepository");
const {client_url} = require("./client_url");

module.exports = function (app, server, auth) {
  const io = socket(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  io.sockets.on("connection", function (client) {
    client.on("subscribe", function (room) {
      console.log("joining room", room);
      client.join(room);
    });

    client.on("unsubscribe", function (room) {
      console.log("leaving room", room);
      client.leave(room);
    });

    client.on("send", function (data) {
      console.log("sending message", data);
      io.sockets.in(data.room).emit("message", data);
    });

    app.post("/emit", auth, (req, res) => {
      console.log(req.body);

      io.sockets.in(req.body.room).emit("message", {
        room: req.body.room,
        message: req.body.message,
        author: req.body.user.username,
      });

      TubeRepository.exists({ tube_id: req.body.room }).then(
        (tubeDoesExist) => {
          if (tubeDoesExist) {
            TubeRepository.findOneAndUpdate(
              { tube_id: req.body.room },
              {
                $push: {
                  messages: { text: req.body.message, username: req.body.user.username},
                },
              },
              { new: true },
              (err, result) => {}
            );
          } else {
            TubeRepository.create({
              tube_id: req.body.room,
              title: "Neuer Kanal",
              messages: [],
            }).then(() => {
                TubeRepository.findOneAndUpdate(
                  { tube_id: req.body.room },
                  {
                    $push: {
                      messages: { text: req.body.message, username: req.body.user.username},
                    },
                  },
                  { new: true },
                  (err, result) => {}
                );
            });
          }
        }
      );
      
      res.status(201).json(req.body);
    });
  });
};
