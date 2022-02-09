const jwt = require("jsonwebtoken");
const User = require("../model/user");

const config = process.env;

const verifyToken = async (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
    const userData = await User.findOne({ email: decoded.email });
    req.body.user = userData;
    req.body.auth = true
  } catch (err) {
    req.body.auth = false
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;