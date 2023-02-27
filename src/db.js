const { Pool } = require("pg");
const db = new Pool({
  user: "docker",
  password: "docker",
  database: "finances",
  host: "localhost",
  port: 5432,
});
// comunicação estabelecida com o banco de dados.
// e se for por outro host da empresa?
module.exports = db;
