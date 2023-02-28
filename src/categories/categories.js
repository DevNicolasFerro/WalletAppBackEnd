const { query } = require("express");
const express = require("express");
const router = express.Router();
const db = require("../db");

// função para encontrar dados, Será utilizada mais de uma vez.

const findOne = (id) => {
  return {
    name: "fetch-category",
    text: "SELECT * FROM categories WHERE id=$1",
    values: [Number(id)],
  };
};

// ### ROUTER GET
router.get("/", (req, res) => {
  try {
    db.query("SELECT * FROM categories", (error, response) => {
      if (error) {
        return res.status(500).json(error);
      }
      return res.status(200).json(response.rows);
    });
  } catch (error) {
    return res.status(500).json(error);
  }
});
// parameterized query
// lembrar de colocar o middleware
router.post("/", (req, res) => {
  try {
    // desconstrução de objeto
    const { name } = req.body;
    // validação do banco de dados, devido as constraints
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    if (name.length < 3) {
      return res.status(400).json({ error: "must have more than 3 charactrs" });
    }

    const text = "INSERT INTO categories(name) VALUES($1) RETURNING *";
    const values = [name];
    db.query(text, values, (error, response) => {
      if (error) {
        return res.status(500).json(error);
      }
      return res.status(200).json(response.rows);
    });
    return res.status(200);
  } catch (error) {
    return res.status(500).json(error);
  }
});
// Crio uma função com o método POST. Toda função gera um requeriment and a response.
//neste caso, desconstruo o obj pois ele está vindo dentro do body.
//a query é oq vai fazer com esse dado que entrou, oq é e oq vai usar, sendo uma nova função
// toda função gera um requiriment and a response

// sempre tenho que criar uma variavel com os comandos queries do banco de dados, se for em typescript
// vou ter quer declarar o tipo de dado que vai atuar

// ####DELEÇÃO DE DADOS
// ':' significa que estou passando um parametro.
//Primeiro: Comunicação para ver se está chegando.(console.log(req.params))
//Segundo: verificar se existe no banco de dados, FindOne.
// descontruir o objeto que chega

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params; // desconstrução da requisição http

    //validação para se for feita uma requisição sem o id
    if (!id) {
      return res.status(400).json({ error: "param id is mandatory" });
    }

    //Encontrar o ID, Caso seja passado um ID
    const query = findOne(id);

    // O id foi passado, agora deve-se verificar se existe no db.
    // É um função assincrona, pois devemos esperar a resposta do db

    const category = await db.query(query);

    //Se não existir a categoria que foi fornecida
    if (!category.rows[0]) {
      return res.status(404).json({ error: "category not found" });
    }

    // para fazer a deleção dos dados
    const text = "DELETE FROM categories WHERE id=$1 RETURNING *";
    const values = [Number(id)];
    const deleteResponse = await db.query(text, values);

    // se ocorrer um erro na deleção
    if (!category.rows[0]) {
      return res.status(400).json({ error: "category not deleted" });
    }

    // Se o ID for encontrado, será deletado o conteúdo, por isso '.rows'
    return res.status(200).json(deleteResponse.rows);
  } catch (error) {
    return res.status(500).json(error); // posso colocar um console.log no lugar do json.
    // dessa forma, consigo ver pelo terminal onde está o erro. '.json(console.log(error))
  }
});

module.exports = router; // tenho que exportar, se não crio e não acontece nada
// e tenho que pegar no index.js
