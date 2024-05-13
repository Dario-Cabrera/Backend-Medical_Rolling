const { Schema, model } = require("mongoose");

const AppointmentsModel = new Schema({
  user: {
    type: String,
    required: true,
  },
  doctor: {
    type: String,
    required: true,
  },
  appointmentDate: {
    type: String,
    required: true,
  },
  appointmentTime: {
    type: String,
    required: true,
  },
  state: {
    type: Boolean,
    default: true,
  },
});

module.exports = model("appointments", AppointmentsModel);
