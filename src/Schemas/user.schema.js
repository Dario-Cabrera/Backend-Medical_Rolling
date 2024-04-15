const { z } = require("zod");

const registerUserSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(3, "Name must be at least 3 characters long"),
  lastname: z
    .string({ required_error: "Lastname is required" })
    .min(3, "Lastname must be at least 3 characters long"),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email" }),
  province: z.string({ required_error: "Province is required" }),
  area: z.number({ required_error: "Area is required" }),
  phone: z.number({ required_error: "Phone is required" }),
  pass: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters long")
    .max(80, "Password must not exceed 80 characters"),
  address: z.string({ required_error: "Address is required" }),
});

const loginUserSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email" }),
  pass: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters long")
    .max(80, "Password must not exceed 80 characters"),
});

module.exports = { registerUserSchema, loginUserSchema };
