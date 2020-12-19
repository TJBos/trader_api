///////////////////////////
// Environmental Variables
///////////////////////////
const AuthRouter = require("./controllers/user.js");
const auth = require("./auth");

require("dotenv").config();
const {
  PORT = 5000,
  SECRET = "topsecret",
  NODE_ENV = "development",
} = process.env;

//CORS
const cors = require("cors");
const corsOptions = require("./configs/cors.js");

//MONGO CONNECTION
const mongoose = require("./DB/conn");

//AUTH
const jwt = require("jsonwebtoken");

//Bringing in Express
const express = require("express");
const app = express();

//OTHER IMPORTS
const morgan = require("morgan");
const holdingRouter = require("./controllers/holding");

////////////
//MIDDLEWARE
////////////
app.use(cors());
app.use(express.json());
app.use(morgan("tiny")); //logging

///////////////
//Routes and Routers
//////////////

app.use("/auth", AuthRouter);

app.use(
  "/holdings",
  //auth,
  holdingRouter
);
//LISTENER
app.listen(PORT, () => {
  console.log(`Your are listening on port ${PORT}`);
});
