import { Menu } from "@mantine/core";
import styles from './MenuThemeExtension.module.css';

const MenuThemeExtension = Menu.extend({
  classNames: styles,
});

export default MenuThemeExtension;