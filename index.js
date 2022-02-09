const http = require("http");
const socket_handler = require('./socket_handler');
const auth = require("./middleware/auth");
const app = require("./app");


const server = http.createServer(app);
const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

socket_handler(app, server, auth);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
