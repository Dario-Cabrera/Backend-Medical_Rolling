const { z } = require("zod");

const registerDoctorSchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  lastname: z.string({ required_error: "Lastname is required" }),
  email: z.string({ required_error: "Email is required" }),
  pass: z.string({ required_error: "Password is required" }),
  specialty: z.string({ required_error: "Specialty is required" }),
  LicenceNumber: z.number({ required_error: "Licence Number is required" }),
  isDoctor: z.boolean({ required_error: "Is Doctor is required" }),
  isAuditor: z.boolean({ required_error: "Is Auditor is required" }),
});

const loginDoctorSchema = z.object({
    email: z.string({ required_error: "Email is required" }),
    pass: z.string({ required_error: "Password is required" }),
  });

module.exports = { registerDoctorSchema, loginDoctorSchema };