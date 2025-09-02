"use client";

import React from "react";
import Link from "next/link";
import useAuth from "@/features/auth/authN/components/useAuth";
import { Role } from "@/types/user-types";
import styles from "./Navbar.module.css";
import logo from "@/../public/logo.png";
import { logOut } from "@/features/auth/authN/googleAuthN";
import { MdLogout } from "react-icons/md";

const navbarLinks: { name: string; href: string; roles: Role[] }[] = [
  { name: "Students", href: "/students", roles: ["ADMIN", "STAFF"] },
  {
    name: "Surveys",
    href: "/surveys",
    roles: ["ADMIN", "STAFF"],
  },
];

export default function Navbar() {
  const auth = useAuth();
  const role: Role = auth.token?.claims.role as Role;

  return (
    <nav className={styles.navbar}>
      {/* Logo on the left */}
      <div>
        <Link href="/">
          <img
            className={styles.logo}
            src={logo.src}
            alt="Swaliga Foundation Logo"
            height={40}
            width={40}
          />
        </Link>
      </div>

      {/* Centered Text Container */}
      {(auth.token?.claims.email_verified as boolean) && (
        <div className={styles.navElementContainer}>
          {navbarLinks
            .filter((item) => item.roles.includes(role))
            .map((item, index) => (
              <Link key={index} href={item.href} className={styles.navLink}>
                <span className={styles.navElement}>{item.name}</span>
              </Link>
            ))}
        </div>
      )}

      {/* Logout Icon */}
      {auth.token && (
        <div onClick={() => logOut()}>
          <MdLogout className={styles.profile} size={40} title="Logout" />
        </div>
      )}
    </nav>
  );
}
