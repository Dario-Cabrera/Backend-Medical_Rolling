const express = require("express");
const router = express.Router();
const { postDoctor } = require("../Controllers");
const { postDoctorLogin } = require("../Controllers");
const { getAllDoctors, getDoctorById } = require("../Controllers");
const { deleteDoctorById } = require("../Controllers");
const { updateDoctorById } = require("../Controllers");
const { validateToken } = require("../Auth/validateToken");

router.post("/createdoctor/", postDoctor);

router.post("/logindoctor", postDoctorLogin);

router.get("/gettingdoctors", getAllDoctors);

router.get("/getonedoctor/:id", getDoctorById);

router.delete("/deletedoctors/:id", deleteDoctorById);

router.put("/updatedoctors/:id", updateDoctorById);

module.exports = router;
