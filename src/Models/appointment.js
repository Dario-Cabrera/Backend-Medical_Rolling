const { Schema, model } = require("mongoose");

const AppointmentsModel = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  doctor: {
    type: Schema.Types.ObjectId,
    ref: "doctors",
    required: true,
  },
  appointmentDate: {
    type: Date,
    required: true,
  },
  appointmentTime: {
    type: Date,
    required: true,
  },
  state: {
    type: Boolean,
    default: true,
  },
  // No se si se guarda como objeto (Hora y minutos)
});

module.exports = model("appointments", AppointmentsModel);
