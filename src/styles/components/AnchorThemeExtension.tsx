import { Anchor } from "@mantine/core";
import NextLink from "next/link";

const AnchorThemeExtension = Anchor.extend({
  defaultProps: {
    component: NextLink,
    underline: 'not-hover'
  }
});

export default AnchorThemeExtension;