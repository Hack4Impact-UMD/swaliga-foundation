import useGenerateCustomAuthResetPasswordCode from "@/features/auth/authN/hooks/useGenerateCustomAuthResetPasswordCode"
import { modals } from "@mantine/modals"

export function GenerateCustomAuthResetPasswordModal() {
  const generateCustomAuthResetPasswordCodeMutation = useGenerateCustomAuthResetPasswordCode();
  
  return <div>hello</div>
}

export default function openGenerateCustomAuthResetPasswordModal() {
  modals.open({
    title: "Generate Code",
    children: <GenerateCustomAuthResetPasswordModal />
  })
}