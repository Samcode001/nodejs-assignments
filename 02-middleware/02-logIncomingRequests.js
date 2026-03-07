//  Create a middleware that logs all incoming requests to the console.

const express = require("express");
const app = express();

function logRequests(req, res, next) {
  // write the logic for request log here
  let date = new Date();
  console.log(`${req.method} ${req.url} - ${date.toISOString()}`);
  next();
}

app.use(logRequests);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello, world!" });
});

// app.listen(3000, () => console.log("300"));
module.exports = app;
