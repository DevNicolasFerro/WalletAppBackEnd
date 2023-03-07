const { query } = require("express");
const express = require("express");
const router = express.Router();
const db = require("../db");

// função para encontrar dados no banco de dados
const categoriesID = require("../queries/categories");
const findEmail = require("../queries/users");

router.post("/", async (req, res) => {
  try {
    //##Desconstruções objetos recebidos
    const { email } = req.headers;
    const { category_id, title, date, value } = req.body;

    //### VALIDAÇÕES

    //validação de email
    if (email.length < 5 || !email.includes("@")) {
      return res.status(400).json({
        error: "invalid email",
      });
    }
    //validação category ID
    if (!category_id) {
      return res.status(400).json({
        error: "category id is mandatory",
      });
    }
    //validação title
    if (!title && title < 3) {
      return res.status(400).json({
        error: "title is mandatory and must have more than 3 characters",
      });
    }
    //validação data
    if (!date || title.length < 3) {
      return res.status(400).json({
        error: "Date is mandatory and must be yyyy-mm-dd",
      });
    }
    //validação Valor
    if (!value) {
      return res.status(400).json({
        error: "value is mandatory",
      });
    }
    // validação de email existente

    const userQuery = await db.query(findEmail.findByUser(email));
    if (!userQuery.rows[0]) {
      return res.status(404).json({ error: "User already exist" });
    }

    //validação categoria
    const category = await db.query(categoriesID.findOne(category_id));
    if (!category) {
      return res.status(400).json({ error: "category not found" });
    }

    //##CRIAÇÃO DA CATEGORIA
    const text =
      "INSERT INTO finances(user_id,category_id,date,title,value) VALUES($1,$2,$3,$4,$5) RETURNING *";
    const values = [userQuery.rows[0].id, category_id, date, title, value];
    const createResponse = await db.query(text, values);
    if (!createResponse.rows[0]) {
      return res.status(400).json({ error: "finance not created" });
    }
    return res.status(200).json(createResponse.rows[0]);
  } catch (error) {
    res.status(500).json(console.log(error));
  }
});

module.exports = router;
