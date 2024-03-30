const { Schema, model } = require("mongoose");

const AppointmentSchemaUser = new Schema({
  id: {
    type: String,
    required: true,
  },
  dateTime: {
    type: Date,
    required: true,
  },
});

const UserModel = new Schema({
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
  },
  province: {
    type: String,
    require: true,
  },
  area: {
    type: Number,
    require: true,
  },
  phone: {
    type: Number,
    require: true,
  },
  pass: {
    type: String,
    require: true,
    minlength: 8,
    maxlength: 90,
  },
  isDoctor: {
    type: Boolean,
    require: true,
  },
  isAuditor: {
    type: Boolean,
    require: true,
  },
  appointments: [AppointmentSchemaUser],
  //Estos son los turnos, que serán un objeto que contenga fecha y hora.
});

module.exports = model("users", UserModel);
