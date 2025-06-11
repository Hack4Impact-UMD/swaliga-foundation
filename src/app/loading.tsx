import styles from "./loading.module.css";

export default function LoadingPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.header}>Loading...</h1>
      </div>
    </div>
  );
}
