import { z } from "zod";

export const StaffSchema = z.object({
  position: z.string().min(1, {
    message: "position is required",
  }),
  available: z.boolean().default(false),
});
