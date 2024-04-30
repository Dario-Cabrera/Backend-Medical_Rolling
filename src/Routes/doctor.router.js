const express = require("express");
const router = express.Router();
const { postDoctor } = require("../Controllers");
const { postDoctorLogin } = require("../Controllers");
const { getAllDoctors, getDoctorById, checkDniDoctorAvailability, checkEmailDoctorAvailability } = require("../Controllers");
const { deleteDoctorById } = require("../Controllers");
const { updateDoctorById } = require("../Controllers");
const { validateToken } = require("../Auth/validateToken");
const { validateSchema } = require("../Auth/validator.middleware");
const { registerDoctorSchema, loginDoctorSchema } = require("../schemas/doctor.schema");
const { verifyDoctor } = require("../Controllers");

router.post("/createdoctor/", validateSchema(registerDoctorSchema), postDoctor);

router.post("/logindoctor", validateSchema(loginDoctorSchema), postDoctorLogin);

router.post("/verifyDoctor", verifyDoctor);

router.get("/checkDniDoctor/:dni", checkDniDoctorAvailability);

router.get("/checkEmailDoctor/:email", checkEmailDoctorAvailability);

router.get("/gettingdoctors", getAllDoctors);

router.get("/getonedoctor/:id", getDoctorById);

router.delete("/deletedoctors/:id", deleteDoctorById);

router.put("/updatedoctors/:id", updateDoctorById);

module.exports = router;
