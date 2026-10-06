"use client";

import BlankBackgroundPage from "@/components/layout/pages/BlankBackgroundPage";
import ClubTable from "@/features/clubs/management/components/ClubTable";
import styles from "./ClubsPage.module.css";

export default function ClubsPage() {
  return (
    <BlankBackgroundPage>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.headerText}>Clubs</h1>
        </div>
        <ClubTable />
      </div>
    </BlankBackgroundPage>
  );
}
