import moment, { isMoment } from "moment";
import { z } from "zod";

const ROLES = ["ADMIN", "STAFF", "STUDENT"];
const RoleSchema = z.enum(ROLES);
type Role = z.infer<typeof RoleSchema>

const NameSchema = z.object({
  firstName: z.string().min(1),
  middleName: z.string().min(1).optional(),
  preferredName: z.string().min(1).optional(),
  lastName: z.string().min(1),
});
type Name = z.infer<typeof NameSchema>;

const GENDERS = ["Male", "Female", "Non-Binary", "Other"]
const GenderSchema = z.enum(GENDERS);
type Gender = z.infer<typeof GenderSchema>;

const ETHNICITIES = [
  "Black or African American",
  "Indigenous",
  "Asian",
  "White",
  "Multiracial",
  "Latin",
  "Other"
]
const EthnicitySchema = z.enum(ETHNICITIES);
type Ethnicity = z.infer<typeof EthnicitySchema>;

const AddressSchema = z.object({
  addressLine1: z.string().min(1),
  addressLine2: z.string().min(1).optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  zipCode: z.number().min(10000).max(99999)
});
type Address = z.infer<typeof AddressSchema>;

const PersonSchema = z.object({
  name: NameSchema,
  gender: GenderSchema,
  phone: z.e164().optional(),
  email: z.email().optional(),
});
type Person = z.infer<typeof PersonSchema>;

const GUARDIAN_RELATIONSHIPS = ["Father", "Mother", "Legal Guardian", "Other"];
const GuardianRelationshipSchema = z.enum(GUARDIAN_RELATIONSHIPS);
type GuardianRelationship = z.infer<typeof GuardianRelationshipSchema>;

const GuardianSchema = PersonSchema.safeExtend({
  email: z.email(),
  relationship: GuardianRelationshipSchema
});
type Guardian = z.infer<typeof GuardianSchema>;

const BaseUserSchema = PersonSchema.safeExtend({
  role: RoleSchema,
  uid: z.string().optional()
});
type BaseUser = z.infer<typeof BaseUserSchema>;

const StudentSchema = BaseUserSchema.safeExtend({
  id: z.number().min(1000000),
  role: z.literal("STUDENT"),
  dateOfBirth: z.preprocess((val) => isMoment(val) ? val.toDate() : val, z.date()),
  joinedSwaligaDate: z.preprocess((val) => isMoment(val) ? val.toDate() : val, z.date()).optional(),
  ethnicity: z.array(EthnicitySchema),
  guardians: z.array(GuardianSchema),
  address: AddressSchema.optional(),
  school: z.object({
    name: z.string().min(1),
    address: AddressSchema.optional(),
    grade: z.number().min(1).max(12),
    gradYear: z.number().min(1900).max(2100).optional(),
    gpa: z.number().min(0).max(5).optional()
  })
});
type Student = z.infer<typeof StudentSchema>;

export function getFullName(name: Name): string {
  const { firstName, middleName, lastName } = name;
  return `${firstName} ${middleName ? `${middleName} ` : ""}${lastName}`
}

const StaffSchema = BaseUserSchema.safeExtend({
  email: z.email(),
  role: z.literal("STAFF")
});
type Staff = z.infer<typeof StaffSchema>;

const AdminSchema = BaseUserSchema.safeExtend({
  email: z.email(),
  role: z.literal("ADMIN")
});
type Admin = z.infer<typeof AdminSchema>;

export function getFullAddress(address: Address | undefined): string {
  if (!address) return "N/A";
  const { addressLine1, addressLine2, city, state, country, zipCode } = address;
  return `${addressLine1}${addressLine2 ? `, ${addressLine2}` : ""}, ${city}, ${state}, ${country} ${zipCode}`;
}

export type Gender =
  | "Male"
  | "Female"
  | "Non-Binary"
  | (string & {});
export const genderValues = ["Male", "Female", "Non-Binary", "Other"];

export type Ethnicity =
  | "Black or African American"
  | "Indigenous"
  | "Asian"
  | "White"
  | "Multiracial"
  | "Latin"
  | (string & {});
export const ethnicityValues = [
  "Black or African American",
  "Indigenous",
  "Asian",
  "White",
  "Multiracial",
  "Latin",
  "Other"
]