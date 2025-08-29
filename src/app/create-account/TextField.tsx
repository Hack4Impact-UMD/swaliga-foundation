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
  maxLength?: number;
}

export default function TextField(props: TextFieldProps) {
  const {
    label,
    value,
    onChange,
    required = false,
    disabled = false,
    icon,
    maxLength = undefined,
  } = props;
  const placeholder = props.placeholder || label;
  return (
    <div className={styles.inputGroup}>
      <Label label={label} required={required} />
      <div className={`${styles.inputField} ${disabled ? styles.disabledInputField : ""}`}>
        {cloneElement(icon, { className: styles.inputIcon })}
        <input
          className={styles.inputText}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            if (maxLength && e.target.value.length > maxLength) return;
            if (onChange) onChange(e);
          }}
          disabled={disabled}
        />
      </div>
      <span className={styles.characterCount}>
        {maxLength && `${value.length}/${maxLength}`}
      </span>
    </div>
  );
}
