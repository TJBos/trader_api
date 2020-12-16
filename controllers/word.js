const Word = require("../models/word");
const { Router } = require("express");
const router = Router();
require("dotenv").config();
//const fetch = require("node-fetch");
//const { APIKEY } = process.env;
const auth = require("../auth");
const { SECRET } = process.env;
const jwt = require("jsonwebtoken");

//index route
router.get("/", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const payload = jwt.verify(token, SECRET);
  //console.log(payload.username)
  res.json(
    await Word.find({
      user: payload.username,
    })
  );
});

//create route
router.post("/", async (req, res) => {
  res.json(await Word.create(req.body));
});

//update route
router.put("/:id", async (req, res) => {
  res.json(
    await Word.findByIdAndUpdate(req.params.id, req.body, { new: true })
  );
});

//delete route
router.delete("/:id", async (req, res) => {
  res.json(await Word.findByIdAndRemove(req.params.id));
});

// EXPORT ROUTER
module.exports = router;
//test
