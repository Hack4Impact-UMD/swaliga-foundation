import z from "zod";
import { AddressSchema } from "./user-types";

const ClubSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  address: AddressSchema,
});
export type Club = z.infer<typeof ClubSchema>;