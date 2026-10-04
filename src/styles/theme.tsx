import { MantineThemeOverride } from "@mantine/core";
import AnchorThemeExtension from "./components/AnchorThemeExtension";
import ImageThemeExtension from "./components/ImageThemeExtension";
import MenuThemeExtension from "./components/MenuThemeExtension";

const theme: MantineThemeOverride = {
  components: {
    Anchor: AnchorThemeExtension,
    Image: ImageThemeExtension,
    Menu: MenuThemeExtension
  }
};

export default theme;