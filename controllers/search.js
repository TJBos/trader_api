const { Router } = require("express");
const router = Router();
require("dotenv").config();
const fetch = require("node-fetch");
const { API_KEY } = process.env;
const { REDIS_URL } = process.env;

//This API call uses Redis caching //change URL for deployment
const redis = require("redis");
const client = redis.createClient(REDIS_URL);
client.on("error", (err) => console.log(err));

router.get("/:id", (req, res) => {
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
          `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${searchTerm}&apikey=${API_KEY}`
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

module.exports = router;
