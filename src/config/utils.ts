export function getFunctionsURL(functionName: string) {
  return process.env.NODE_ENV === 'development' ? `${process.env.NEXT_PUBLIC_FUNCTIONS_EMULATOR_HOST}/swaliga-foundation/us-central1/${functionName}` : `https://${functionName.toLowerCase()}-fuicsqotja-uc.a.run.app`;
}