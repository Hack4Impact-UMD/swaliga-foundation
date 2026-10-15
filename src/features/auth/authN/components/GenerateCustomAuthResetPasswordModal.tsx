import useGenerateCustomAuthResetPasswordCode from "@/features/auth/authN/hooks/useGenerateCustomAuthResetPasswordCode";
import { modals } from "@mantine/modals";
import { useEffect, useState } from "react";
import { ActionIcon, CopyButton, PasswordInput } from "@mantine/core";
import { MdContentCopy } from "react-icons/md";
import { clsx } from "clsx";
import styles from "./GenerateCustomAuthResetPasswordModal.module.css";

interface GenerateCustomAuthResetPasswordModalProps {
  uid: string;
}

export function GenerateCustomAuthResetPasswordModal(
  props: GenerateCustomAuthResetPasswordModalProps,
) {
  const { uid } = props;

  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const reveal = () => setIsRevealed(true);

  const generateCustomAuthResetPasswordCodeMutation =
    useGenerateCustomAuthResetPasswordCode();
  const generateResetPasswordCode = () => {
    generateCustomAuthResetPasswordCodeMutation.mutate({ uid });
  };
  useEffect(generateResetPasswordCode, []);

  const code = generateCustomAuthResetPasswordCodeMutation.data?.code;
  return (
    <PasswordInput
      classNames={{
        input: clsx(styles.disableInput),
        visibilityToggle: clsx({ [styles.hiddenIcon]: isRevealed })
      }}
      value={code ?? ""}
      label="code"
      loading={generateCustomAuthResetPasswordCodeMutation.isPending}
      error={generateCustomAuthResetPasswordCodeMutation.error}
      visible={isRevealed}
      onVisibilityChange={reveal}
    />
  );
}

export default function openGenerateCustomAuthResetPasswordModal(
  props: GenerateCustomAuthResetPasswordModalProps,
) {
  modals.open({
    title: "Generate Code",
    children: <GenerateCustomAuthResetPasswordModal {...props} />,
  });
}
