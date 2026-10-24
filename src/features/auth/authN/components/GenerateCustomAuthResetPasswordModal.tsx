import useGenerateCustomAuthResetPasswordCode from "@/features/auth/authN/hooks/useGenerateCustomAuthResetPasswordCode";
import { modals } from "@mantine/modals";
import { useEffect, useState } from "react";
import { ActionIcon, CopyButton, PasswordInput } from "@mantine/core";
import { MdContentCopy } from "react-icons/md";
import { clsx } from "clsx";
import styles from "./GenerateCustomAuthResetPasswordModal.module.css";
import { useMutationState } from "@tanstack/react-query";
import moment from "moment";
interface GenerateCustomAuthResetPasswordModalProps {
  uid: string;
}

export function GenerateCustomAuthResetPasswordModal(
  props: GenerateCustomAuthResetPasswordModalProps,
) {
  const { uid } = props;

  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const reveal = () => setIsRevealed(true);

  const prevMutations = useMutationState({
    filters: {
      mutationKey: ['generate-custom-auth-reset-password-code'],
      predicate: (mutation) => (mutation.state.status === "success" || mutation.state.status === "pending") && moment(mutation.state.submittedAt).add(10, 'minutes').isAfter(moment()) && mutation.state.variables.uid === uid
    }
  });
  const latestMutation = prevMutations.length === 0 ? undefined : prevMutations[prevMutations.length - 1];

  const generateCustomAuthResetPasswordCodeMutation =
    useGenerateCustomAuthResetPasswordCode();
  const generateResetPasswordCode = () => {
    if (prevMutations.length === 0) {
      generateCustomAuthResetPasswordCodeMutation.mutate({ uid });
    }
  };
  useEffect(generateResetPasswordCode, []);

  const code = (latestMutation ? latestMutation.data?.code : generateCustomAuthResetPasswordCodeMutation.data?.code) ?? "";
  return (
    <PasswordInput
      classNames={{
        input: clsx(styles.disableInput),
        visibilityToggle: clsx(isRevealed && styles.hiddenIcon),
      }}
      value={code}
      loading={latestMutation?.status === "pending" || generateCustomAuthResetPasswordCodeMutation.isPending}
      disabled={latestMutation?.status === "pending" || generateCustomAuthResetPasswordCodeMutation.isPending}
      error={!latestMutation && generateCustomAuthResetPasswordCodeMutation.error?.message}
      visible={isRevealed}
      onVisibilityChange={reveal}
      rightSection={
        isRevealed ? (
          <CopyButton value={code ?? ""}>
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
    closeOnClickOutside: false
  });
}
