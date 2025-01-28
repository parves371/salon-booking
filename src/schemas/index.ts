import * as z from "zod";

export const NewPAsswordSchema = z.object({
  password: z.string().min(6, {
    message: "min 6 characters required!",
  }),
});
export const Loginchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});
export const ResetSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
});
export const Registerchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  number: z.optional(z.string()),
  password: z.string().min(6, {
    message: "minimum 6 characters required!",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
  date: z.string(),
  address: z.string(),
  avatar: z.any(),
});

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum(["user", "admin"]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Password is required if new password is provided",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: "password is required if new password is provided",
      path: ["password"],
    }
  );
