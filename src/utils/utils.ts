import z from "zod";

export function isEmail(input: string) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(input);
}

export function isDigit(str: string) {
  return /^\d+$/.test(str);
}

// TODO: Add support for country codes outside the USA
export function toE164Phone(phone: string) {
  let e164Phone = "+1";
  for (let i = 0; i < phone.length; i++) {
    if (isDigit(phone[i])) {
      e164Phone += phone[i];
    }
  }
  return e164Phone;
}

export const UUIDSchema = z.uuid().brand<"UUID">();
export type UUID = z.infer<typeof UUIDSchema>;
export function asUUID(str: string): UUID {
  const validationResult = UUIDSchema.safeParse(str);
  if (!validationResult.success) {
    throw new Error("Input is not a valid UUID");
  }
  return validationResult.data as UUID;
}

export const Base64UrlUUIDSchema = z.preprocess((val) => {
  const StringFormatSchema = z.string().regex(/[A-Za-z0-9_-]{22}/);
  const validationResult = StringFormatSchema.safeParse(val);
  return validationResult.success ? validationResult.data : null;
}, z.uuid().brand<"Base64UrlUUID">());
export type Base64UrlUUID = z.infer<typeof Base64UrlUUIDSchema> ;
export function asBase64UrlUuid(str: string): Base64UrlUUID {
  return "5" as Base64UrlUUID;
}


export function uuidToBase64Url(uuid: UUID): Base64UrlUUID {
  return Buffer.from(uuid.replaceAll('-', ''), 'hex').toString('base64url') as Base64UrlUUID;
}

export function base64UrlToUUID(base64UrlUUID: Base64UrlUUID): UUID {
  return Buffer.from(base64UrlUUID, 'base64url').toString('hex') as UUID;
}