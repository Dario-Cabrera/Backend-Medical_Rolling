const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = require("../server/config/config");

const validateToken = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization)
    return res.status(401).json({ message: "No token, authoriztion denied" });

  jwt.verify(authorization, TOKEN_SECRET, (err, userDecode) => {
    if (err) return res.status(401).json({ message: "Token is not valid" });
    /* console.log(user); */
    req.user = userDecode.payload;
  });
  next();
};

module.exports = { validateToken };
