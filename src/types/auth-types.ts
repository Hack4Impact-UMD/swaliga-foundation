import { IdTokenResult } from "firebase/auth";
import { ROLES } from "./user-types";
import { z } from "zod";

const BaseCustomClaimsSchema = z.object({
  role: z.enum(ROLES)
});

const StudentCustomClaimsSchema = BaseCustomClaimsSchema.extend({
  role: z.literal("STUDENT"),
  studentId: z.coerce.number().min(1000000).transform((val) => val.toString())
})
export type StudentCustomClaims = z.infer<typeof StudentCustomClaimsSchema>;

const StaffCustomClaimsSchema = BaseCustomClaimsSchema.extend({
  role: z.literal("STAFF")
})
export type StaffCustomClaims = z.infer<typeof StaffCustomClaimsSchema>;

const AdminCustomClaimsSchema = BaseCustomClaimsSchema.extend({
  role: z.literal("ADMIN")
})
export type AdminCustomClaims = z.infer<typeof AdminCustomClaimsSchema>;

const CustomClaimsSchema = z.union([StudentCustomClaimsSchema, StaffCustomClaimsSchema, AdminCustomClaimsSchema]);
export type CustomClaims = z.infer<typeof CustomClaimsSchema>;


export type StudentDecodedIdTokenWithCustomClaims = IdTokenResult & StudentCustomClaims;
export type StaffDecodedIdTokenWithCustomClaims = IdTokenResult & StaffCustomClaims;
export type AdminDecodedIdTokenWithCustomClaims = IdTokenResult & AdminCustomClaims;
export type DecodedIdTokenWithCustomClaims = StudentDecodedIdTokenWithCustomClaims | StaffDecodedIdTokenWithCustomClaims | AdminDecodedIdTokenWithCustomClaims;