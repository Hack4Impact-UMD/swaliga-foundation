import z from "zod";
import { AddressSchema } from "./user-types";
import { isMoment } from "moment";

export const ClubSchema = z.object({
  clubId: z.uuid(),
  name: z.string().min(1),
  address: AddressSchema,
});
export type Club = z.infer<typeof ClubSchema>;

export const ClubDocSchema = ClubSchema.omit({
  clubId: true
});
export type ClubDoc = z.infer<typeof ClubDocSchema>;

export const AGE_GROUPS = ["Varsity", "Junior Varsity"] as const;
export const AgeGroupSchema = z.enum(AGE_GROUPS);
export type AgeGroup = z.infer<typeof AgeGroupSchema>;

export const ProgramSchema = z.object({
  programId: z.uuid(),
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

export const ProgramDocSchema = ProgramSchema.omit({
  programId: true,
  clubId: true
});
export type ProgramDoc = z.infer<typeof ProgramDocSchema>;