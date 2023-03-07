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
    if (!date || date.length < 3) {
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

    const userQuery = await db.query(findEmail.findUser(email));
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
    res.status(500).json({ error });
  }
});

//##DELEÇÃO DE CONTA
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.headers;
    //Validações

    //validação ID
    if (!id) {
      return res.status(400).json({ error: "id is mandatory" });
    }
    //validação de email
    if (email.length < 5 || !email.includes("@")) {
      return res.status(400).json({
        error: "invalid email",
      });
    }

    //##validação especifícas

    // validação do usuário por email

    const userQuery = await db.query(findEmail.findUser(email));
    if (!userQuery.rows[0]) {
      return res.status(404).json({ error: "User doesn't exist" });
    }

    //queries db

    const findFinanceText = "SELECT * FROM finances WHERE id=$1";
    const findFinaceValue = [Number(id)];
    const financeItem = await db.query(findFinanceText, findFinaceValue);

    // validação se o dado financeiro existe

    if (!financeItem.rows[0]) {
      return res.status(400).json({ error: "finance row not found" });
    }

    //validação se o dado realmente é do usuário
    if (financeItem.rows[0].user_id !== userQuery.rows[0].id) {
      return res
        .status(401)
        .json({ error: "finance row does not belong to user" });
    }

    // ###deleção do dado
    const text = "DELETE FROM finances WHERE id=$1 RETURNING *";
    const values = [Number(id)];
    const deleteResponse = await db.query(text, values);

    //validação apenas se ocorrer um erro na deleção
    if (!deleteResponse.rows[0]) {
      return res.status(400).json({ error: "finance row not deleted" });
    }

    return res.status(200).json(deleteResponse.rows[0]);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

//##GET. http do get não tem body. Eu não passo parametro, e sim query.

router.get("/", async (req, res) => {
  try {
    //?
    const { date } = req.query;
    const { email } = req.headers;

    //validação data
    if (!date || date.length != 10) {
      return res.status(400).json({
        error: "Date is mandatory and must be yyyy-mm-dd",
      });
    }

    //validação de email
    if (email.length < 5 || !email.includes("@")) {
      return res.status(400).json({
        error: "invalid email",
      });
    }
    // validação do usuário por email

    const userQuery = await db.query(findEmail.findUser(email));
    if (!userQuery.rows[0]) {
      return res.status(404).json({ error: "User doesn't exist" });
    }

    //## funcionou fazer um obj
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth();
    const initDate = new Date(year, month, 1).toISOString();
    const lastDate = new Date(year, month + 1, 0).toISOString(); // gambiarra JS. Como não tem dia 0, pega o ultimo do mês anterior

    const text =
      "SELECT fin.title, fin.value, fin.date, fin.user_id, fin.category_id, cat.name FROM finances as fin JOIN categories as cat ON fin.category_id = cat.id WHERE fin.user_id = $1 AND fin.date BETWEEN $2 AND $3 ORDER BY fin.date ASC";

    const values = [userQuery.rows[0].id, initDate, lastDate];
    const financeQuery = await db.query(text, values);

    //Ainda posso não ter nenhum dado
    return res.status(200).json(financeQuery.rows);
  } catch (error) {
    return res.status(500).json(console.log(error));
  }
});

module.exports = router;
