const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

const port = process.env.PORT || 3001;

app.use(bodyParser.json());

const { authenticateToken } = require("./services/authenticationToken");

app.use("/users", require("./routes/auth"));
app.use("/invoices", authenticateToken, require("./routes/invoices"));

app.get("/", (req, res) => {
  res.send("Welcome to iTro Customer");
});

mongoose
  .connect(
    "mongodb+srv://phucly:6J0UaO4A9T3lE2Yj@quanlytro-kcaua.mongodb.net/shop?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(result => {
    console.log("Database connected successfully");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(error => {
    console.log(error.message);
  });
