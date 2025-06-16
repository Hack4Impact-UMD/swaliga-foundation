"use client";

import styles from "./TextField.module.css";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
  required?: boolean;
}

export default function TextField(props: TextFieldProps) {
  const { name, icon, required = false, ...remainingProps } = props;

  return (
    <div className={styles.inputField}>
      <label className={styles.fieldLabel}>
        {name}
        {required && <span className={styles.requiredAsterisk}> *</span>}
      </label>
      <div className={styles.inputIconGroup}>
        {icon}
        <input type="text" placeholder={name} {...remainingProps} />
      </div>
    </div>
  );
}
