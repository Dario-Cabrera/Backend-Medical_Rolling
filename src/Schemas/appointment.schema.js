const { z } = require("zod");

const registerAppointmentSchema = z.object({
  appointmentDate: z.string({ required_error: "AppointmentDate is required" }).optional(),
  appointmentTime: z.string({ required_error: "AppointmentTime is required" }).optional(),
});

module.exports = { registerAppointmentSchema };
