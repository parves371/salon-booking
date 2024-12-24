import { z } from "zod";

export const CategorySchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
});
export const ServicesSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  price: z.string().min(1, {
    message: "Price is required",
  }),
  time: z.string().min(1, {
    message: "Time is required",
  }),
  option: z.optional(z.boolean().default(false)),
});
