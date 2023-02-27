const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  db.query("SELECT * FROM categories", (error, response) => {
    if (error) {
      return res.status(500).json(error);
    }
    return res.status(200).json(response.rows);
  });
});
// parameterized query
// lembrar de colocar o middleware
router.post("/", (req, res) => {
  // desconstrução de objeto
  const { name } = req.body;
  // validação do banco de dados, devido as constraints
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
  if (name.length < 3) {
    return res.status(400).json({ error: "must have more than 3 charactrs" });
  }

  const text = "INSERT INTO categories(name ) VALUES($1) RETURNING *";
  const values = [name];
  db.query(text, values, (error, response) => {
    if (error) {
      return res.status(500).json(error);
    }
    return res.status(200).json(response.rows);
  });
  return res.status(200);
});
// Crio uma função com o método POST. Toda função gera um requeriment and a response.
//neste caso, desconstruo o obj pois ele está vindo dentro do body.
//a query é oq vai fazer com esse dado que entrou, oq é e oq vai usar, sendo uma nova função
// toda função gera um requiriment and a response
// sempre tenho que criar uma variavel com os comandos queries do banco de dados, se for em typescript
// vou ter quer declarar o tipo de dado que vai atuar
router.post("/", (req, res) => {});
module.exports = router; // tenho que exportar, se não crio e não acontece nada
// e tenho que pegar no index.js
