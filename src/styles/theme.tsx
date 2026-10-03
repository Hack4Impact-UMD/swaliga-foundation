import { MantineThemeOverride } from "@mantine/core";
import MenuThemeExtension from "./components/MenuThemeExtension";

const theme: MantineThemeOverride = {
  components: {
    Menu: MenuThemeExtension
  }
};

export default theme;