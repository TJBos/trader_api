const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

//This function receives your token payload and contains the logic to verify if the user is genuine.

const verifyUser = (payload) => {
  //logic to verify user, return true if the user exists, return false otherwise
  return true;
};

//this function is passed in your JWT secret returns the auth middleware so to use it would be app.use(auth(SECRET)) or app.get('/', auth(), (req, res) => {})
const auth = (secret) => {
  return (req, res, next) => {
    try {
      if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        const payload = jwt.verify(token, secret);
        if (verifyUser(payload)) {
          req.payload = payload;
          next();
        } else {
          res.status(400).send("Failed Authentication");
        }
      }
    } catch (err) {
      res.status(400).send(err);
    }
  };
};

module.exports = {
  auth,
};
