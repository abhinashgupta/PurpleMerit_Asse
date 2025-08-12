require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
  if (err) {
    console.log("Error connecting to server ", err);
  }
  console.log("Server is running on PORT", PORT);
});
