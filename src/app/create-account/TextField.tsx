import { ChangeEvent, cloneElement } from "react";
import styles from "./TextField.module.css";
import Label from "./Label";

interface TextFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  icon: JSX.Element;
}

export default function TextField(props: TextFieldProps) {
  const {
    label,
    value,
    onChange,
    required = false,
    disabled = false,
    icon,
  } = props;
  const placeholder = props.placeholder || label;
  return (
    <div className={styles.inputGroup}>
      <Label label={label} required={required} />
      <div className={styles.inputField}>
        {cloneElement(icon, { className: styles.inputIcon })}
        <input
          className={styles.inputText}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
