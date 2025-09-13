import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import styles from "./layout.module.css";
import AuthProvider from "@/features/auth/authN/components/AuthProvider";
import Navbar from "@/components/layout/Navbar";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import AvailabilityProvider from "@/features/auth/authZ/AvailabilityProvider";
import SurveysProvider from "@/data/hooks/useSurveys/SurveysProvider";
import StudentsProvider from "@/data/hooks/useStudents/StudentsProvider";
import Footer from "@/components/layout/Footer";
import { Tooltip } from "@/components/ui/Tooltip";

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
          <Tooltip.Provider delayDuration={0}>
            <AuthProvider>
              <Navbar />
              <AvailabilityProvider>
                <SurveysProvider>
                  <StudentsProvider>{children}</StudentsProvider>
                </SurveysProvider>
              </AvailabilityProvider>
            </AuthProvider>
            <Footer />
          </Tooltip.Provider>
        </Suspense>
      </body>
    </html>
  );
}
