import { ChangeEvent, cloneElement } from "react";
import styles from "./Select.module.css";
import Label from "./Label";

interface SelectProps {
  label: string;
  values: string[];
  selectedValue: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  otherText: string;
  onOtherTextChange: (e: ChangeEvent<HTMLInputElement>) => void;
  icon: JSX.Element;
  maxOtherLength?: number;
}

export default function Select(props: SelectProps) {
  const {
    label,
    values,
    selectedValue,
    onChange,
    otherText,
    onOtherTextChange,
    icon,
    maxOtherLength = undefined,
  } = props;
  return (
    <div className={styles.inputGroup}>
      <Label label={label} required />
      <div className={styles.inputField}>
        {cloneElement(icon, { className: styles.inputIcon })}
        <select
          className={styles.inputSelect}
          value={selectedValue}
          onChange={onChange}
        >
          {values.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        {selectedValue === "Other" && (
          <div className={styles.otherTextContainer}>
            <input
              className={styles.inputText}
              type="text"
              placeholder="Please specify"
              value={otherText}
              onChange={(e) => {
                if (maxOtherLength && e.target.value.length > maxOtherLength) return;
                onOtherTextChange(e);
              }}
              hidden={true}
            />
            {maxOtherLength && (
              <span
                className={styles.characterCount}
              >{`${otherText.length}/${maxOtherLength}`}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
