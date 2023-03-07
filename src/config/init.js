/// comunicação para executar os endPoints

const tableQueries = require("../queries/tables");
const db = require("../db");

const init =async()=>{ 

  try{ 
    await db.connect();  
    await db.query(tableQueries.createUsers());
    await db.query(tableQueries.createCategory());
    await db.query(tableQueries.createFinance());
    console.log('succesfully created tables'); 
    await db.end(); 
    return;
  } 
  catch( error) {
    throw new error("error to connecting to database", error);
  };
}
init()