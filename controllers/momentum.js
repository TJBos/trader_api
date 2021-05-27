const { Router } = require("express");
const router = Router();
require("dotenv").config();
const { PythonShell } = require("python-shell");
const preload = require("./preload.json");
const _ = require("lodash");

router.get("/", (req, res, next) => {
  let options = {
    mode: "text",
    pythonOptions: ["-u"],
    scriptPath: "./py_files",
  };

  PythonShell.run("momentum.py", options, function (err, result) {
    if (err) throw err;
    // result is an array consisting of messages collected
    //during execution of script.
    const fixed = {};
    _.forOwn(result, function (value, key, object) {
      fixed[key] = _.values(value);
    });
    res.send(fixed);
    //res.send(result.toString());
  });
});

//TEST
router.get("/preload", (req, res) => {
  const fixed = {};
  _.forOwn(preload, function (value, key, object) {
    fixed[key] = _.values(value);
  });
  res.send(fixed);
});

module.exports = router;
