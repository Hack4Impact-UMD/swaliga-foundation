import z from "zod";
import { Buffer } from "buffer";

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
  return validationResult.data;
}

export const Base64UrlUUIDSchema = z.string().regex(/^[A-Za-z0-9_-]{22}$/, "Invalid input").transform((val) => {
  const hexStr = Buffer.from(base64UrlToBase64(val), 'base64').toString('hex');
  return `${hexStr.substring(0, 8)}-${hexStr.substring(8, 12)}-${hexStr.substring(12, 16)}-${hexStr.substring(16, 20)}-${hexStr.substring(20, 32)}`;
}).pipe(z.uuid("Invalid input")).transform((val) => base64ToBase64Url(Buffer.from(val.replaceAll('-', ''), 'hex').toString('base64'))).brand<"Base64UrlUUID">();
export type Base64UrlUUID = z.infer<typeof Base64UrlUUIDSchema>;
export function asBase64UrlUuid(str: string): Base64UrlUUID {
  const validationResult = Base64UrlUUIDSchema.safeParse(str);
  if (!validationResult.success) {
    throw new Error("Input is not a valid UUID");
  }
  return validationResult.data;
}

export function base64UrlEncodeUUID(uuid: UUID): Base64UrlUUID {
  return base64ToBase64Url(Buffer.from(uuid.replaceAll('-', ''), 'hex').toString('base64')) as Base64UrlUUID;
}

export function base64UrlDecodeUUID(base64UrlUUID: Base64UrlUUID): UUID {
  const uuidWithoutDashes = Buffer.from(base64UrlToBase64(base64UrlUUID), 'base64').toString('hex');
  return `${uuidWithoutDashes.substring(0, 8)}-${uuidWithoutDashes.substring(8, 12)}-${uuidWithoutDashes.substring(12, 16)}-${uuidWithoutDashes.substring(16, 20)}-${uuidWithoutDashes.substring(20, 32)}` as UUID;
}

function base64ToBase64Url(str: string) {
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64UrlToBase64(str: string) {
  let base64Str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64Str.length % 4 !== 0) {
    base64Str += '=';
  }
  return base64Str;
}

export function stripCodeFromFirebaseErrorMessage(err: string) {
  if (/^\s\[\d{3}\]$/.test(err.substring(err.length - 6))) {
    return err.substring(0, err.length - 6);
  }
  return err;
}