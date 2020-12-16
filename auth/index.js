//Auth Middleware
require("dotenv").config();
const { SECRET } = process.env;
const jwt = require("jsonwebtoken");
const cors = require("cors");

const auth = async (req, res, next) => {
  try {
    //check to see if authorization header exists ie: "bearer aslkdjflksja"
    if (req.headers.authorization) {
      console.log("hello");
      const token = req.headers.authorization.split(" ")[1];
      //console.log(token)
      const payload = jwt.verify(token, SECRET);
      //console.log(payload)
      if (payload) {
        req.payload = payload;
        next();
      } else {
        res.status(400).json({ error: "Verification Failed or No Payload" });
      }
    } else {
      res.status(400).json({ error: "No authorization headers" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};

module.exports = auth;
