const express = require("express");
const app = express();
const port = 3000;
const db = require("./db");
const routeCategories = require("./categories/categories");
//middleware. Pois envio e recebo via body e o json é a forma de caixa que envia
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Essa é aplicação walletApp");
});

app.use("/categories", routeCategories); //melhor dividir cada código em uma pasta para ficar mais organizado

app.listen(port, () => {
  db.connect()
    .then(() => console.log("db connected"))
    .catch((error) => {
      throw new error(error);
    });
  console.log(`Example app listening on port ${port}`);
});
