const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = require("../server/config/config");

const createAccessToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        payload,
      },
      TOKEN_SECRET,
      {
        expiresIn: "1d",
      },
      (error, token) => {
        error && reject(error);
        resolve(token);
      }
    );
  });
};

module.exports = { createAccessToken };
