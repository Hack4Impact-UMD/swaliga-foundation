import z from "zod";
import { AddressSchema } from "./user-types";
import { isMoment } from "moment";

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
  startDate: z.preprocess(obj => isMoment(obj) ? obj.toDate() : obj, z.date()),
  endDate: z.preprocess(obj => isMoment(obj) ? obj.toDate() : obj, z.date()),
  studentIds: z.array(z.number()),
  teacherIds: z.array(z.number()),
  staffIds: z.array(z.number()),
});
export type Program = z.infer<typeof ProgramSchema>;