import { getEnvironment } from "@/utils/envUtils";

export function getFunctionsURL(functionName: string) {
  return getEnvironment() === 'development' ? `${process.env.NEXT_PUBLIC_FUNCTIONS_EMULATOR_HOST}/swaliga-foundation/us-central1/${functionName}` : `https://${functionName.toLowerCase()}-fuicsqotja-uc.a.run.app`;
}