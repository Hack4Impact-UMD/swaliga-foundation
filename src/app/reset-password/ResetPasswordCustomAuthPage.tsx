"use client";

import ImageBackgroundPage from "@/components/layout/pages/ImageBackgroundPage";
import useResetPasswordCustomAuth from "@/features/auth/authN/hooks/useResetPasswordCustomAuth";
import { useForm } from "@tanstack/react-form";
import z from "zod";
import styles from "./ResetPasswordCustomAuthPage.module.css";
import { Anchor, Button, PasswordInput, Text, TextInput } from "@mantine/core";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import {
  Base64UrlUUIDSchema,
  stripCodeFromFirebaseErrorMessage,
} from "@/utils/utils";
import { checkPasswordValidity } from "@/features/auth/authN/emailPasswordAuthN";
import clsx from "clsx";

const ResetPasswordCustomAuthFormSchema = z
  .object({
    username: z.string().min(1, "Username can't be empty."),
    newPassword: z.string().refine(async (password) => {
      await checkPasswordValidity(password);
      return true;
    }, "Password must be between 6 and 4096 characters"),
    confirmNewPassword: z.string(),
    code: Base64UrlUUIDSchema,
  })
  .refine((obj) => obj.newPassword === obj.confirmNewPassword, {
    message: "Password confirmation must be the same as password.",
    path: ["confirmNewPassword"],
  });
type ResetPasswordCustomAuthForm = z.infer<
  typeof ResetPasswordCustomAuthFormSchema
>;

const DEFAULT_VALUES: Record<keyof ResetPasswordCustomAuthForm, string> = {
  username: "",
  newPassword: "",
  confirmNewPassword: "",
  code: "",
};

export default function ResetPasswordCustomAuthPage() {
  const resetPasswordCustomAuthMutation = useResetPasswordCustomAuth();

  const router = useRouter();

  const form = useForm({
    defaultValues: DEFAULT_VALUES,
    onSubmit: async ({ value, formApi }) => {
      const validationResult =
        await ResetPasswordCustomAuthFormSchema.safeParseAsync(value);
      if (!validationResult.success) {
        throw new Error("Unable to submit form");
      }

      try {
        await resetPasswordCustomAuthMutation.mutateAsync({
          code: value.code,
          newPassword: value.newPassword,
          username: value.username,
        });
        router.push("/");
      } catch (err: any) {
        formApi.setErrorMap({
          onSubmit: {
            form: stripCodeFromFirebaseErrorMessage(err.message),
            fields: {},
          },
        });
      }
    },
    validators: {
      //onChangeAsync: ResetPasswordCustomAuthFormSchema,
      //onChangeAsyncDebounceMs: 1000,
    },
  });

  return (
    <ImageBackgroundPage>
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <h1 className={styles.header}>Reset Password</h1>
          <form.Field name="username" validators={{
            onBlur: ResetPasswordCustomAuthFormSchema.shape.username,
            onChange: ResetPasswordCustomAuthFormSchema.shape.username,
            onSubmit: ResetPasswordCustomAuthFormSchema.shape.username,
          }}>
            {(field) => (
              <TextInput
                classNames={{
                  label: styles.inputFieldLabel,
                  description: styles.inputFieldDescription,
                }}
                label={"Username"}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                error={
                  field.state.meta.isTouched
                    ? field.state.meta.errors
                        .map((err) =>
                          typeof err === "string" ? err : err?.message,
                        )
                        .join(", ")
                    : undefined
                }
              />
            )}
          </form.Field>
          <form.Field name="newPassword">
            {(field) => (
              <PasswordInput
                classNames={{
                  label: styles.inputFieldLabel,
                  description: styles.inputFieldDescription,
                }}
                label={"New Password"}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                error={
                  field.state.meta.isTouched
                    ? field.state.meta.errors
                        .map((err) =>
                          typeof err === "string" ? err : err?.message,
                        )
                        .join(", ")
                    : undefined
                }
              />
            )}
          </form.Field>
          <form.Field name="confirmNewPassword">
            {(field) => (
              <PasswordInput
                classNames={{
                  label: styles.inputFieldLabel,
                  description: styles.inputFieldDescription,
                }}
                label={"Confirm New Password"}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                error={
                  field.state.meta.isTouched
                    ? field.state.meta.errors
                        .map((err) =>
                          typeof err === "string" ? err : err?.message,
                        )
                        .join(", ")
                    : undefined
                }
              />
            )}
          </form.Field>
          <form.Field name="code">
            {(field) => (
              <TextInput
                classNames={{
                  label: styles.inputFieldLabel,
                  description: styles.inputFieldDescription,
                }}
                label={"Code"}
                description={
                  "Please ask your Swaliga teacher or admin for this code."
                }
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                error={
                  field.state.meta.isTouched
                    ? field.state.meta.errors
                        .map((err) =>
                          typeof err === "string" ? err : err?.message,
                        )
                        .join(", ")
                    : undefined
                }
              />
            )}
          </form.Field>
          <Anchor
            href="/reset-password?auth=standard"
            className={styles.customAuthResetPasswordRedirect}
          >
            Signed up with an email? Click here.
          </Anchor>
          <Button
            classNames={{
              root: clsx(styles.button, styles.submitButton),
            }}
            onClick={form.handleSubmit}
            loading={form.state.isSubmitting}
          >
            Reset Password
          </Button>
          <Text className={styles.error}>
            {form.state.errors
              .map((err) => (typeof err === "string" ? err : err?.message))
              .join(", ")}
          </Text>
        </div>
        <div className={styles.returnButtonContainer}>
          <Button
            classNames={{
              root: clsx(styles.button, styles.returnHomeButton),
            }}
            leftSection={<FaArrowLeft />}
            onClick={() => router.push("/")}
          >
            Return to Home
          </Button>
        </div>
      </div>
    </ImageBackgroundPage>
  );
}
