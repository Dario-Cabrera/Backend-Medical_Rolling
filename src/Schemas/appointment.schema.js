const { z } = require("zod");

const registerAppointmentSchema = z.object({
  appointmentDate: z
    .string({ required_error: "AppointmentDate is required" })
    .datetime()
    .optional(),
  appointmentTime: z
    .string({ required_error: "AppointmentTime is required" })
    .datetime()
    .optional(),
});

module.exports = { registerAppointmentSchema };
