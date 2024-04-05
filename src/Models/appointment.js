const { Schema, model } = require("mongoose");

const AppointmentsModel = new Schema({
  appointmentDate: {
    type: Date,
    require: true,
  },
  appointmentTime: {
    type: Date,
    require: true,
  },
  // No se si se guarda como objeto (Hora y minutos)
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
});

module.exports = model("appointments", AppointmentsModel);
