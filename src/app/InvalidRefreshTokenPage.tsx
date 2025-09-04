"use client";

import useAuth from "@/features/auth/authN/components/useAuth";
import { Role } from "@/types/user-types";
import styles from "./InvalidRefreshTokenPage.module.css";
import Link from "next/link";
import { getFunctionsURL } from "@/config/utils";

export default function InvalidRefreshTokenPage() {
  const auth = useAuth();
  const role = auth.token?.claims.role as Role;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h3 className={styles.text}>
          {role === "ADMIN" ? (
            <>
              The Google refresh token associated with this account is invalid
              or missing. This token allows us to integrate with Google services
              such as Forms and Drive to provide this website's full
              functionality. Please click{" "}
              <Link
                href={`${getFunctionsURL("startOAuth2Flow")}?idToken=${
                  auth.token?.token
                }`}
              >
                here
              </Link>{" "}
              to regenerate the refresh token.
            </>
          ) : (
            "Features of this website are currently unavailable. Please contact Swaliga Foundation administrators to resolve this issue."
          )}
        </h3>
      </div>
    </div>
  );
}
