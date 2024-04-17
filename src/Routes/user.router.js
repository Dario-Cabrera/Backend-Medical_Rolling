const express = require("express");
const router = express.Router();
const { postUser } = require("../Controllers");
const { postUserLogin } = require("../Controllers");
const { getAllUsers, getUserById } = require("../Controllers");
const { deleteUserById } = require("../Controllers");
const { updateUserById } = require("../Controllers");
const { validateToken } = require("../Auth/validateToken");
const { validateSchema } = require("../Auth/validator.middleware");
const {
  registerUserSchema,
  loginUserSchema,
} = require("../schemas/user.schema");
const { verifyToken } = require("../Controllers");
const { verifyDoctor } = require("../Controllers");

router.post("/createuser/", validateSchema(registerUserSchema), postUser); //

router.post("/loginuser", validateSchema(loginUserSchema), postUserLogin);

router.post("/verifyuser", verifyToken);

router.get("/gettingusers", validateToken, getAllUsers);

router.get("/getoneuser/:id", validateToken, getUserById);

router.delete("/deleteusers/:id", validateToken, deleteUserById);

router.put("/updateusers/:id", validateToken, updateUserById);

module.exports = router;
