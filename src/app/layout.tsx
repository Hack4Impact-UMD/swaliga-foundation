import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import styles from "./layout.module.css";
import AuthProvider from "@/features/auth/AuthProvider";
import Navbar from "@/components/ui/Navbar";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import AvailabilityProvider from "@/features/auth/AvailabilityProvider";
import SurveysProvider from "@/data/hooks/SurveysProvider";
import StudentsProvider from "@/data/hooks/StudentsProvider";

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
            <AvailabilityProvider>
              <SurveysProvider>
                <StudentsProvider>{children}</StudentsProvider>
              </SurveysProvider>
            </AvailabilityProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
