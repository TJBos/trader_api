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
const wordRouter = require("./controllers/word");

////////////
//MIDDLEWARE
////////////
app.use(cors());
app.use(express.json());
app.use(morgan("tiny")); //logging

///////////////
//Routes and Routers
//////////////
//Route for testing server is working
// app.get("/", (req, res) => {
//   res.json({ hello: "Hello World!" });
// });

// Word Routes send to dog router

// // //Auth router
// app.get('/', auth, (req, res) => {
//   res.json(req.payload)
// })

app.use("/auth", AuthRouter);

app.use("/word", auth, wordRouter);
//LISTENER
app.listen(PORT, () => {
  console.log(`Your are listening on port ${PORT}`);
});
