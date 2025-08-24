import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import styles from "./layout.module.css";
import AuthProvider from "@/features/auth/AuthProvider";
import Navbar from "@/components/ui/Navbar";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import DataProvider from "@/features/auth/DataProvider";

const LoadingPage = dynamic(() => import("./loading"));

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Swaliga Foundation",
  description: "Swaliga Foundation's Student Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${styles.body}`}>
        <Suspense fallback={<LoadingPage />}>
          <AuthProvider>
            <Navbar />
            <DataProvider>{children}</DataProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
