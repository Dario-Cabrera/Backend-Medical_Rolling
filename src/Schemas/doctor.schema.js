const { z } = require("zod");

const registerDoctorSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(3, "Name must be at least 3 characters long"),
  lastname: z
    .string({ required_error: "Lastname is required" })
    .min(3, "Lastname must be at least 3 characters long"),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email" }),
  pass: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters long")
    .max(80, "Password must not exceed 80 characters"),
  specialty: z.string({ required_error: "Specialty is required" }),
  LicenceNumber: z.number({ required_error: "Licence Number is required" }),
});

const loginDoctorSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email" }),
  pass: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters long")
    .max(80, "Password must not exceed 80 characters"),
});

module.exports = { registerDoctorSchema, loginDoctorSchema };
