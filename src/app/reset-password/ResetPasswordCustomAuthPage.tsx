import ImageBackgroundPage from "@/components/layout/pages/ImageBackgroundPage";
import useResetPasswordCustomAuth from "@/features/auth/authN/hooks/useResetPasswordCustomAuth";
import { useForm } from "@tanstack/react-form";
import z from "zod";

const ResetPasswordCustomAuthFormSchema = z.object({
  username: z.string(),
  newPassword: z.string(),
  code: z.string()
});
type ResetPasswordCustomAuthForm = z.infer<typeof ResetPasswordCustomAuthFormSchema>;

const DEFAULT_VALUES: ResetPasswordCustomAuthForm = {
  username: "",
  newPassword: "",
  code: ""
}

export default function ResetPasswordCustomAuthPage() {
  const resetPasswordCustomAuthMutation = useResetPasswordCustomAuth();

  const form = useForm({
    defaultValues: DEFAULT_VALUES,
    onSubmit: async ({ value }) => {
      resetPasswordCustomAuthMutation.mutate(value);
    }
  });

  return <ImageBackgroundPage>
    
  </ImageBackgroundPage>
}