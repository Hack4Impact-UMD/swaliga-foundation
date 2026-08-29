import { z } from "zod";

export const ROLES = ["ADMIN", "STAFF", "STUDENT"] as const;
export const RoleSchema = z.enum(ROLES);
export type Role = z.infer<typeof RoleSchema>

export const NameSchema = z.object({
  firstName: z.string().min(1),
  middleName: z.string().min(1).optional(),
  preferredName: z.string().min(1).optional(),
  lastName: z.string().min(1),
});
export type Name = z.infer<typeof NameSchema>;

export const PRESET_GENDERS = ["Male", "Female", "Non-Binary"] as const;
export const PresetGenderSchema = z.enum(PRESET_GENDERS);
export type PresetGender = z.infer<typeof PresetGenderSchema>;

export const GenderSchema = z.union([PresetGenderSchema, z.string() as z.ZodType<string & {}>]);
export type Gender = z.infer<typeof GenderSchema>;

export function isPresetGender(gender: Gender): gender is PresetGender {
  // @ts-ignore
  return PRESET_GENDERS.includes(gender);
}

export const PRESET_ETHNICITIES = [
  "Black or African American",
  "Indigenous",
  "Asian",
  "White",
  "Multiracial",
  "Latin",
] as const;
export const PresetEthnicitySchema = z.enum(PRESET_ETHNICITIES);
export type PresetEthnicity = z.infer<typeof PresetEthnicitySchema>;

export const EthnicitySchema = z.union([PresetEthnicitySchema, z.string() as z.ZodType<string & {}>]);
export type Ethnicity = z.infer<typeof EthnicitySchema>;

export function isPresetEthnicity(ethnicity: Ethnicity): ethnicity is PresetEthnicity {
  // @ts-ignore
  return PRESET_ETHNICITIES.includes(ethnicity);
}

export const AddressSchema = z.object({
  addressLine1: z.string().min(1),
  addressLine2: z.string().min(1).optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  zipCode: z.number().min(10000).max(99999)
});
export type Address = z.infer<typeof AddressSchema>;

export const PersonSchema = z.object({
  name: NameSchema,
  gender: GenderSchema,
  phone: z.e164().optional(),
  email: z.email().optional(),
});
export type Person = z.infer<typeof PersonSchema>;

export const PRESET_GUARDIAN_RELATIONSHIPS = ["Father", "Mother", "Legal Guardian"] as const;
export const PresetGuardianRelationshipSchema = z.enum(PRESET_GUARDIAN_RELATIONSHIPS);
export type PresetGuardianRelationship = z.infer<typeof PresetGuardianRelationshipSchema>;

export const GuardianRelationshipSchema = z.union([PresetGuardianRelationshipSchema, z.string() as z.ZodType<string & {}>]);
export type GuardianRelationship = z.infer<typeof GuardianRelationshipSchema>;
export function isPresetGuardianRelationship(relationship: GuardianRelationship): relationship is PresetGuardianRelationship {
  // @ts-ignore
  return PRESET_GUARDIAN_RELATIONSHIPS.includes(relationship);
}

export const GuardianSchema = PersonSchema.safeExtend({
  relationship: GuardianRelationshipSchema
});
export type Guardian = z.infer<typeof GuardianSchema>;

export const BaseUserSchema = PersonSchema.safeExtend({
  role: RoleSchema,
  uid: z.string().optional()
});
export type BaseUser = z.infer<typeof BaseUserSchema>;

export const StudentSchema = BaseUserSchema.safeExtend({
  id: z.coerce.number().min(1000000).transform((val) => val.toString()),
  role: z.literal("STUDENT"),
  dateOfBirth: z.iso.datetime(),
  joinedSwaligaDate: z.iso.datetime().optional(),
  ethnicity: z.array(EthnicitySchema),
  guardians: z.array(GuardianSchema),
  address: AddressSchema.optional(),
  school: z.object({
    name: z.string().min(1),
    address: AddressSchema.optional(),
    grade: z.number().min(1).max(12),
    gradYear: z.number().min(1900).max(2100).optional(),
    gpa: z.number().min(0).max(5).optional()
  }),
  isArchived: z.boolean()
});
export type Student = z.infer<typeof StudentSchema>;

export function getFullName(name: Name): string {
  const { firstName, middleName, lastName } = name;
  return `${firstName} ${middleName ? `${middleName} ` : ""}${lastName}`
}

export const StaffSchema = BaseUserSchema.safeExtend({
  email: z.email(),
  role: z.literal("STAFF")
});
export type Staff = z.infer<typeof StaffSchema>;

export const AdminSchema = BaseUserSchema.safeExtend({
  email: z.email(),
  role: z.literal("ADMIN")
});
export type Admin = z.infer<typeof AdminSchema>;

export const UserSchema = z.union([AdminSchema, StaffSchema, StudentSchema]);
export type User = z.infer<typeof UserSchema>;

export function getFullAddress(address: Address | undefined): string {
  if (!address) return "N/A";
  const { addressLine1, addressLine2, city, state, country, zipCode } = address;
  return `${addressLine1}${addressLine2 ? `, ${addressLine2}` : ""}, ${city}, ${state}, ${country} ${zipCode}`;
}