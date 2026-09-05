import z from "zod";
import { AddressSchema } from "./user-types";

const ClubSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  address: AddressSchema,
});
export type Club = z.infer<typeof ClubSchema>;

const AGE_GROUPS = ["Varsity", "Junior Varsity"] as const;
const AgeGroupSchema = z.enum(AGE_GROUPS);
type AgeGroup = z.infer<typeof AgeGroupSchema>;

const ProgramSchema = z.object({
  id: z.uuid(),
  clubId: z.uuid(),
  name: z.string().min(1),
  ageGroup: AgeGroupSchema,
  startDate: z.preprocess(z => ),
  endDate: z.preprocess(z => ),
  studentIds: z.array(z.number()),
  teacherIds: z.array(z.number()),
  staffIds: z.array(z.number()),
});
export type Program = z.infer<typeof ProgramSchema>;

