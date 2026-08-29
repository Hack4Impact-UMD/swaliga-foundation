import { z } from "zod";

export const IDSchema = z.object({
  id: z.string().min(1),
})
export type ID = z.infer<typeof IDSchema>;