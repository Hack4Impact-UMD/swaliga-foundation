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