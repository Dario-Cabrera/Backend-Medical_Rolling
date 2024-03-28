const express = require('express');
const router = express.Router();
const { postUser, postDoctor, postAppointment } = require('../Controllers');
const { getAllUsers, getAllDoctors, getAllAppointments, getUserById, getDoctorById, getAppointmentById } = require('../Controllers');
const { deleteUserById, deleteDoctorById, deleteAppointmentById } = require('../Controllers');
const { updateUserById, updateDoctorById, updateAppointmentById } = require('../Controllers');

// ----------------POST----------------

//---------POST register----------

router.post('/createuser/', postUser);
router.post('/createdoctor/', postDoctor);
router.post('/createappointment/', postAppointment);

// ----------------POST----------------

// ----------------GETALL----------------

router.get('/gettingusers', getAllUsers);
router.get('/gettingdoctors', getAllDoctors);
router.get('/gettingappointments', getAllAppointments);

// ----------------GETALL----------------

// ------------GETBYID-GETONE------------

router.get('/getoneuser/:id', getUserById);
router.get('/getonedoctor/:id', getDoctorById);
router.get('/getoneappointment/:id', getAppointmentById);

// ------------GETBYID-GETONE------------

// ----------------DELETE----------------

router.delete('/deleteusers/:id', deleteUserById);
router.delete('/deletedoctors/:id', deleteDoctorById);
router.delete('/deleteappointments/:id', deleteAppointmentById);

// ----------------DELETE----------------

// ----------------UPDATE----------------

router.put('/updateusers/:id', updateUserById);
router.put('/updatedoctors/:id', updateDoctorById);
router.put('/updateappointments/:id', updateAppointmentById);

// ----------------UPDATE----------------

module.exports = router