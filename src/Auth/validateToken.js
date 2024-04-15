const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = require("../server/config/config");

const validateToken = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization)
    return res.status(401).json({ message: "No token, authorization denied1" });

  jwt.verify(authorization, TOKEN_SECRET, (err, userDecode) => {
    if (err)
      return res.status(401).json({ message: "User token is not valid" });

    req.user = userDecode.payload; // Acceso al payload del token de usuario
  });

  next();
};

module.exports = { validateToken };
