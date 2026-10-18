"use client";

import ImageBackgroundPage from "@/components/layout/pages/ImageBackgroundPage";
import useResetPasswordCustomAuth from "@/features/auth/authN/hooks/useResetPasswordCustomAuth";
import { useForm } from "@tanstack/react-form";
import z from "zod";
import styles from "./ResetPasswordCustomAuthPage.module.css";
import { Anchor } from "@mantine/core";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Base64UrlUUIDSchema } from "@/utils/utils";
import { checkPasswordValidity } from "@/features/auth/authN/emailPasswordAuthN";

const ResetPasswordCustomAuthFormSchema = z
  .object({
    username: z.string(),
    newPassword: z
      .string()
      .refine(
        async (password) => checkPasswordValidity(password),
        "Invalid password",
      ),
    confirmNewPassword: z.string(),
    code: Base64UrlUUIDSchema,
  })
  .refine(
    (obj) => obj.newPassword === obj.confirmNewPassword,
    "Password confirmation must be the same as password.",
  );
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

  const form = useForm({
    defaultValues: DEFAULT_VALUES,
    onSubmit: async ({ value }) => {
      const validationResult =
        await ResetPasswordCustomAuthFormSchema.safeParseAsync(value);
      if (validationResult.success) {
        throw new Error("Unable to submit form");
      }
      resetPasswordCustomAuthMutation.mutate(value);
    },
    validators: {
      onChangeAsync: ResetPasswordCustomAuthFormSchema,
      onChangeAsyncDebounceMs: 1000,
    },
  });

  const router = useRouter();

  return (
    <ImageBackgroundPage>
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <h1 className={styles.header}>Reset Password</h1>
          <form.Field name="username">
            {(field) => (
              <input
                className={styles.inputField}
                placeholder={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>
          <form.Field name="newPassword">
            {(field) => (
              <input
                className={styles.inputField}
                placeholder={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>
          <form.Field name="confirmNewPassword">
            {(field) => (
              <input
                className={styles.inputField}
                placeholder={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>
          <form.Field name="code">
            {(field) => (
              <input
                className={styles.inputField}
                placeholder={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>
          <Anchor
            href="/reset-password?auth=builtin"
            className={styles.customAuthResetPasswordRedirect}
          >
            Signed up with an email? Click here.
          </Anchor>
          <button
            className={`${styles.button} ${styles.submitButton}`}
            onClick={form.handleSubmit}
          >
            Send Reset Email
          </button>
        </div>
        <div className={styles.returnButtonContainer}>
          <button
            className={`${styles.button} ${styles.returnHomeButton}`}
            onClick={() => router.push("/")}
          >
            <FaArrowLeft /> Return to Home
          </button>
        </div>
      </div>
    </ImageBackgroundPage>
  );
}
