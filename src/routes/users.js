const { query } = require("express");
const express = require("express");
const router = express.Router();
const db = require("../db");

// função para encontrar dados, Será utilizada mais de uma vez.
const findEmail = require("../queries/users");

//POST
// não posso colocar "./users", pois já está sendo redirecionado no index
router.post("/", async (req, res) => {
  try {
    // Toda vez que faz uma criação, validação do body

    // resquisção do input, desconstrução do objeto
    const { name, email } = req.body;

    // validação de nome
    if (name.length < 3) {
      return res.status(400).json({
        error: "name should have more than 3 characters",
      });
    }
    //validação de email
    if (email.length < 5 || !email.includes("@")) {
      return res.status(400).json({
        error: "invalid email",
      });
    }
    // fim da validação do body
    // Query
    const query = findEmail.findUser(email);

    // validação de email existente
    const alreadyExist = await db.query(query);
    if (alreadyExist.rows[0]) {
      return res.status(404).json({ error: "User already exist" });
    }

    const text = "INSERT INTO users(name, email) VALUES($1,$2) RETURNING *";
    const values = [name, email];
    const createResponse = await db.query(text, values);
    if (!createResponse.rows[0]) {
      return res.status(400).json({ error: "user not created" });
    }
    //criação de um novo usuário na posição 0
    return res.status(200).json(createResponse[0]);
  } catch (error) {
    return res.status(500).json(error);
  }
});

///###UPTDATE

router.put("/", async (req, res) => {
  try {
    const oldEmail = req.headers.email;
    // receber o usuário e verificar se ele realmente existe
    // simulação autenticação
    const { name, email } = req.body;
    //validação de email
    if (email.length < 5 || !email.includes("@")) {
      return res.status(400).json({
        error: "invalid email",
      });
    }
    // validação nome
    if (name.length < 3) {
      return res.status(400).json({
        error: "name should have more than 3 characters",
      });
    }
    if (oldEmail.length < 5 || !oldEmail.includes("@")) {
      return res.status(400).json({
        error: "invalid email",
      });
    }
    // validação email unico
    const query = findEmail.findUser(oldEmail);
    const alreadyExist = await db.query(query);
    if (!alreadyExist.rows[0]) {
      return res.status(404).json({ error: "User doesn't exist" });
    }

    const text =
      "UPDATE users SET name=$1, email=$2 WHERE email=$3 RETURNING *";
    const values = [name, email, oldEmail];
    const updateResponse = await db.query(text, values);
    if (!updateResponse.rows[0]) {
      return res.status(400).json({ error: "user not updated" });
    }

    return res.status(200).json(updateResponse.rows[0]);
  } catch (error) {
    return res.status(500).json(console.log(error));
  }
});

module.exports = router; // tenho que exportar, se não crio e não acontece nada
// e tenho que pegar no index.js
