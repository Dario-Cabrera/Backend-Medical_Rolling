const { z } = require("zod");

const registerUserSchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  lastname: z.string({ required_error: "Lastname is required" }),
  email: z.string({ required_error: "Email is required" }),
  province: z.string({ required_error: "Province is required" }),
  area: z.number({ required_error: "Area is required" }),
  phone: z.number({ required_error: "Phone is required" }),
  pass: z.string({ required_error: "Password is required" }),
  address: z.string({ required_error: "Address is required" }),
  isDoctor: z.boolean({ required_error: "Is Doctor is required" }),
  isAuditor: z.boolean({ required_error: "Is Auditor is required" }),
});

const loginUserSchema = z.object({
  email: z.string({ required_error: "Email is required" }),
  pass: z.string({ required_error: "Password is required" }),
});

module.exports = { registerUserSchema, loginUserSchema };
