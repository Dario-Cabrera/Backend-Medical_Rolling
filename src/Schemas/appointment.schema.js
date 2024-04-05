const { z } = require("zod");

const registerAppointmentSchema = z.object({
  appointmentDate: z
    .string({ required_error: "AppointmentDate is required" })
    .datetime(),
  appointmentTime: z
    .string({ required_error: "AppointmentTime is required" })
    .datetime(),
});

module.exports = { registerAppointmentSchema };
