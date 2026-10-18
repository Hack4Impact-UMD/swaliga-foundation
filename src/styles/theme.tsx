import { MantineThemeOverride } from "@mantine/core";
import AnchorThemeExtension from "./components/AnchorThemeExtension";
import ImageThemeExtension from "./components/ImageThemeExtension";
import MenuThemeExtension from "./components/MenuThemeExtension";
import TextInputThemeExtension from "./components/TextInputThemeExtension";

const theme: MantineThemeOverride = {
  components: {
    Anchor: AnchorThemeExtension,
    Image: ImageThemeExtension,
    Menu: MenuThemeExtension,
    TextInput: TextInputThemeExtension
  }
};

export default theme;