import { TextInput } from "@mantine/core";
import styles from "./TextInputThemeExtension.module.css";

const TextInputThemeExtension = TextInput.extend({
  classNames: styles
});

export default TextInputThemeExtension;
