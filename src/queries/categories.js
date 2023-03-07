// bloco de texto reutilizavel, boa prática de programação

const findID = {
  findOne: (id) => {
    return {
      name: "fetch-category",
      text: "SELECT * FROM categories WHERE id=$1",
      values: [Number(id)],
    };
  },
};
module.exports = findID;
