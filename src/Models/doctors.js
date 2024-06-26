const { Schema, model } = require("mongoose");

const DoctorsModel = new Schema({
  dni: {
    type: Number,
    require: true,
  },
  name: {
    type: String,
    require: true,
    minlength: 3,
    maxlength: 50,
  },
  lastname: {
    type: String,
    require: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  pass: {
    type: String,
    require: true,
    minlength: 8,
    maxlength: 80,
  },
  specialty: {
    type: String,
    require: true,
  },
  licenceNumber: {
    type: Number,
    require: true,
  },
  isDoctor: {
    type: Boolean,
    default: true,
  },
  isAuditor: {
    type: Boolean,
    default: false,
  },

  //Estos son los turnos, que tiene asignado el medico.
});

module.exports = model("doctors", DoctorsModel);
