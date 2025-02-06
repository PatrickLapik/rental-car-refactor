const express = require("express");
const bodyParser = require("body-parser");
const rental = require("./rentalPrice");
const fs = require("fs");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

const formHtml = fs.readFileSync("form.html", "utf8");
const resultHtml = fs.readFileSync("result.html", "utf8");

app.post("/", (req, res) => {
  const { pickUp, dropOff, pickUpDate, dropOffDate, type, age, licenceIssueDate } = req.body;
  const result = rental.price({
    pickUp,
    dropOff,
    pickUpDate,
    dropOffDate,
    type,
    age,
    licenceIssueDate,
  });
  res.send(formHtml + resultHtml.replaceAll("$0", result));
});

app.get("/", (req, res) => {
  res.send(formHtml);
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
