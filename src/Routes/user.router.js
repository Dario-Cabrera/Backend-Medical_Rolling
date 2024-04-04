const express = require("express");
const router = express.Router();
const { postUser } = require("../Controllers");
const { postUserLogin } = require("../Controllers");
const { getAllUsers, getUserById } = require("../Controllers");
const { deleteUserById } = require("../Controllers");
const { updateUserById } = require("../Controllers");
const { validateToken } = require("../Auth/validateToken");

router.post("/createuser/", postUser);

router.post("/loginuser", postUserLogin);

router.get("/gettingusers", validateToken, getAllUsers);

router.get("/getoneuser/:id", validateToken, getUserById);

router.delete("/deleteusers/:id", validateToken, deleteUserById);

router.put("/updateusers/:id", validateToken, updateUserById);

module.exports = router;
