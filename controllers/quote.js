const { Router } = require("express");
const router = Router();
require("dotenv").config();
const fetch = require("node-fetch");
const { API_KEY } = process.env;

router.get("/:id", (req, res) => {
  const searchTerm = req.params.id;
  fetch(
    `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${searchTerm}&apikey=${API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => res.json(data));
});

module.exports = router;
