import useGenerateCustomAuthResetPasswordCode from "@/features/auth/authN/hooks/useGenerateCustomAuthResetPasswordCode"
import { modals } from "@mantine/modals"
import { useEffect } from "react";

interface GenerateCustomAuthResetPasswordModalProps {
  uid: string;
}

export function GenerateCustomAuthResetPasswordModal(props: GenerateCustomAuthResetPasswordModalProps) {
  const { uid } = props;

  const generateCustomAuthResetPasswordCodeMutation = useGenerateCustomAuthResetPasswordCode();
  const generateResetPasswordCode = () => {
    generateCustomAuthResetPasswordCodeMutation.mutate({ uid });
  }
  useEffect(generateResetPasswordCode, []);

  if (!generateCustomAuthResetPasswordCodeMutation.data) {
    return <p>Loading</p>
  }
  return <div>{generateCustomAuthResetPasswordCodeMutation.data.code}</div>
}

export default function openGenerateCustomAuthResetPasswordModal(props: GenerateCustomAuthResetPasswordModalProps) {
  modals.open({
    title: "Generate Code",
    children: <GenerateCustomAuthResetPasswordModal {...props} />
  })
}