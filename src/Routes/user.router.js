const express = require("express");
const router = express.Router();
const { postUser } = require("../Controllers");
const { postUserLogin } = require("../Controllers");
const { getAllUsers, getUserById, checkDniUserAvailability, checkEmailUserAvailability, getUserByDNI } = require("../Controllers");
const { deleteUserById } = require("../Controllers");
const { updateUserById } = require("../Controllers");
const { validateToken } = require("../Auth/validateToken");
const { validateSchema } = require("../Auth/validator.middleware");
const { registerUserSchema, loginUserSchema } = require("../schemas/user.schema");
const { verifyToken } = require("../Controllers");
const { verifyDoctor } = require("../Controllers");

router.post("/createuser/", validateSchema(registerUserSchema), postUser); //

router.post("/loginuser", validateSchema(loginUserSchema), postUserLogin);

router.post("/verifyuser", verifyToken);

router.get("/gettingusers", getAllUsers);

router.get("/getoneuser/:id", getUserById);

router.get("/getUserByDNI/:dni", getUserByDNI);

router.get("/checkDniUser/:dni", checkDniUserAvailability);

router.get("/checkEmailUser/:email", checkEmailUserAvailability);

router.delete("/deleteusers/:id", deleteUserById);

router.put("/updateusers/:id", updateUserById);

module.exports = router;
