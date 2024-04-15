const validateSchema = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    console.log(req.body);
    next();
  } catch (error) {
    console.log(error.errors);
    return res
      .status(400)
      .json(error.errors.map((error) => error.message));
  }
};
module.exports = { validateSchema };
