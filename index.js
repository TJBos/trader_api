///////////////////////////
// Environmental Variables
///////////////////////////
const AuthRouter = require("./controllers/user.js");
const auth = require("./auth");
const { API_KEY } = process.env;
const fetch = require("node-fetch");
const { spawn } = require("child_process");

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
const searchRouter = require("./controllers/search");
const quoteRouter = require("./controllers/quote");
const momentumRouter = require("./controllers/momentum");

////////////
//MIDDLEWARE
////////////
app.use(cors());
app.use(express.json());
app.use(morgan("tiny")); //logging

///////////////
//Routes and Routers
//////////////
//testing the python
const { PythonShell } = require("python-shell");

app.get("/python", (req, res, next) => {
  //Here are the option object in which arguments can be passed for the python_test.js.
  let options = {
    mode: "text",
    pythonOptions: ["-u"], // get print results in real-time
    scriptPath: "./py_files", //If you are having python_test.py script in same folder, then it's optional.
  };

  PythonShell.run("momentum.py", options, function (err, result) {
    if (err) throw err;
    // result is an array consisting of messages collected
    //during execution of script.
    console.log("result printed");
    res.send(result.toString());
  });
});

app.use("/auth", AuthRouter);
app.use("/search", searchRouter);
app.use("/quote", quoteRouter);
app.use("/momentum", momentumRouter);
app.use(
  "/holdings",
  //auth,
  holdingRouter
);
//LISTENER
app.listen(process.env.PORT, () => {
  console.log(`Your are listening on port ${PORT}`);
});
