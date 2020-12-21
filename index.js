///////////////////////////
// Environmental Variables
///////////////////////////
const AuthRouter = require("./controllers/user.js");
const auth = require("./auth");
const { API_KEY } = process.env;
const fetch = require("node-fetch");

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
//this is a TEST for the Redis caching**
const redis = require("redis");
const redisPort = 6379;
const client = redis.createClient(redisPort);
client.on("error", (err) => console.log(err));

app.get("/test/:id", (req, res) => {
  const searchTerm = req.params.id;
  try {
    client.get(searchTerm, async (err, results) => {
      if (err) throw err;

      if (results) {
        res.status(200).send({
          results: JSON.parse(results),
          message: "data retrieved from the cache",
        });
      } else {
        fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${searchTerm}&apikey=${API_KEY}`
        )
          .then((response) => response.json())
          .then((data) => {
            client.setex(searchTerm, 600, JSON.stringify(data));
            res.status(200).send({
              results: data,
              message: "cache miss",
            });
          });
      }
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.use("/auth", AuthRouter);

app.use(
  "/holdings",
  //auth,
  holdingRouter
);
//LISTENER
app.listen(process.env.PORT, () => {
  console.log(`Your are listening on port ${PORT}`);
});
