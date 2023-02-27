const express = require("express");
const app = express();
const port = 3000;
const db = require("./db");

app.get("/", (req, res) => {
  res.send("Essa é aplicação walletApp");
});

app.get("/categories", (req, res) => {
  db.query("SELECT * FROM categories", (error, response) => {
    if (error) {
      return res.status(500).json(error);
    }
    return res.status(200).json(response.rows);
  });
});

app.listen(port, () => {
  db.connect()
    .then(() => console.log("db connected"))
    .catch((error) => {
      throw new error(error);
    });
  console.log(`Example app listening on port ${port}`);
});
