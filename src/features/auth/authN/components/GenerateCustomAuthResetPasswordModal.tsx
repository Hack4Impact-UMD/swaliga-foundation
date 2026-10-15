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
  console.log(isRevealed);

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
        visibilityToggle: clsx(isRevealed && styles.hiddenIcon),
      }}
      value={code}
      loading={generateCustomAuthResetPasswordCodeMutation.isPending}
      error={generateCustomAuthResetPasswordCodeMutation.error?.message}
      visible={isRevealed}
      onVisibilityChange={reveal}
      rightSection={
        isRevealed ? (
          <CopyButton value="code">
            {({ copied, copy }) => (
              <ActionIcon variant="light" color="gray" onClick={copy}>
                <MdContentCopy color={copied ? "green" : undefined} />
              </ActionIcon>
            )}
          </CopyButton>
        ) : undefined
      }
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
