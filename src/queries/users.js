// bloco de texto reutilizavel, boa prática de programação
const findEmail = {
  findUser: (email) => {
    return {
      name: "fetch-user",
      text: "SELECT * FROM users WHERE email= $1",
      values: [email],
    };
  },
};
module.exports = findEmail;
