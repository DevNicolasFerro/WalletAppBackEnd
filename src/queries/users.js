// bloco de texto reutilizavel, boa prática de programação
const findEmail = {
  findByUser: (email, query) => {
    return {
      name: query,
      text: "SELECT * FROM users WHERE email= $1",
      values: [email],
    };
  },
};
module.exports = findEmail;
