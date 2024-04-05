const express = require("express");
const router = express.Router();
const { postDoctor } = require("../Controllers");
const { postDoctorLogin } = require("../Controllers");
const { getAllDoctors, getDoctorById } = require("../Controllers");
const { getAppointmentsByDoctorId } = require("../Controllers");
const { deleteDoctorById } = require("../Controllers");
const { updateDoctorById } = require("../Controllers");
const { validateToken } = require("../Auth/validateToken");
const { validateSchema } = require("../Auth/validator.middleware");
const { registerDoctorSchema, loginDoctorSchema } = require("../Schemas/doctor.schema");

router.post("/createdoctor/", validateSchema(registerDoctorSchema), postDoctor);

router.post("/logindoctor", validateSchema(loginDoctorSchema), postDoctorLogin);

router.get("/gettingdoctors", getAllDoctors);

router.get("/getonedoctor/:id", getDoctorById);

router.get("/appointments/:doctorId", getAppointmentsByDoctorId);

router.delete("/deletedoctors/:id", deleteDoctorById);

router.put("/updatedoctors/:id", updateDoctorById);

module.exports = router;
