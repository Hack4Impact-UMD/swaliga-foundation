import styles from "./Label.module.css";

interface LabelProps {
  label: string;
  required?: boolean;
}

export default function Label(props: LabelProps) {
  const { label, required = false } = props;
  return (
    <label>
      {label}
      {required && (
        <>
          {" "}
          <span className={styles.requiredAsterisk}>*</span>
        </>
      )}
    </label>
  );
}
