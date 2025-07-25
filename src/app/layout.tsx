import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import styles from "./layout.module.css";
import AuthProvider from "@/features/auth/AuthProvider";
import Navbar from "@/components/ui/Navbar";
import DataProvider from "@/data/hooks/DataProvider";
import { Suspense } from "react";
import LoadingPage from "./loading";

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
            <DataProvider>{children as JSX.Element}</DataProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
