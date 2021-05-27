//ENVIRONMENT VARIABLES
require("dotenv").config();

//CORS
const cors = require("cors");
const corsOptions = require("./configs/cors.js");

//MONGO CONNECTION
const mongoose = require("./DB/conn");

//AUTH
const auth = require("./auth");

const express = require("express");
const app = express();

//OTHER IMPORTS and ROUTERS
const morgan = require("morgan");
const AuthRouter = require("./controllers/user.js");
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
  console.log(`Your are listening on port ${process.env.PORT}`);
});
