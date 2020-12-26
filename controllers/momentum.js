const { Router } = require("express");
const router = Router();
require("dotenv").config();
const { PythonShell } = require("python-shell");

router.get("/", (req, res, next) => {
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

module.exports = router;
