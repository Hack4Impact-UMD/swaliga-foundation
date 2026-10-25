import { PasswordInput } from "@mantine/core";
import styles from "./PasswordInputThemeExtension.module.css";

const PasswordInputThemeExtension = PasswordInput.extend({
  classNames: styles
});

export default PasswordInputThemeExtension;
