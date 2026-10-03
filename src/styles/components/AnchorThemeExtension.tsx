import { Anchor } from "@mantine/core";
import NextLink from "next/link";

const AnchorThemeExtension = Anchor.extend({
  defaultProps: {
    component: NextLink,
  }
});

export default AnchorThemeExtension;