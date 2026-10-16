import { functions } from "@/config/firebaseConfig";
import { useMutation } from "@tanstack/react-query";
import { httpsCallable } from "firebase/functions";
import z from "zod";

const ResetPasswordCustomAuthRequestSchema = z.object({
  username: z.string(),
  newPassword: z.string(),
  code: z.string()
});
type ResetPasswordCustomAuthRequest = z.infer<typeof ResetPasswordCustomAuthRequestSchema>;

async function resetPasswordCustomAuth(req: ResetPasswordCustomAuthRequest) {
  const validationResult = ResetPasswordCustomAuthRequestSchema.safeParse(req);
  if (!validationResult.success) {
    throw new Error("Invalid Request");
  }
  return await httpsCallable(functions, 'resetPasswordCustomAuth')(req);
}

export default function useResetPasswordCustomAuth() {
  return useMutation({
    mutationFn: resetPasswordCustomAuth
  })
}