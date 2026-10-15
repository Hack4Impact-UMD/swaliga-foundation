import { functions } from "@/config/firebaseConfig";
import { useMutation } from "@tanstack/react-query";
import { httpsCallable } from "firebase/functions";
import z from "zod";

const GenerateCustomAuthResetPasswordCodeRequestSchema = z.object({
  uid: z.string(),
});
export type GenerateCustomAuthResetPasswordCodeRequest = z.infer<typeof GenerateCustomAuthResetPasswordCodeRequestSchema>;

const GenerateCustomAuthResetPasswordCodeResponseSchema = z.object({
  code: z.string()
});
export type GenerateCustomAuthResetPasswordCodeResponse = z.infer<typeof GenerateCustomAuthResetPasswordCodeResponseSchema>;

async function generateCustomAuthResetPasswordCode(req: GenerateCustomAuthResetPasswordCodeRequest) {
  const requestValidationResult = GenerateCustomAuthResetPasswordCodeRequestSchema.safeParse(req);
  if (!requestValidationResult.success) {
    throw new Error("Invalid Request")
  }
  const res = await httpsCallable<GenerateCustomAuthResetPasswordCodeRequest, GenerateCustomAuthResetPasswordCodeResponse>(functions, "generateCustomAuthResetPasswordCode")(req);
  return res.data;
}

export default function useGenerateCustomAuthResetPasswordCode() {
  return useMutation({
    mutationFn: generateCustomAuthResetPasswordCode
  })
}