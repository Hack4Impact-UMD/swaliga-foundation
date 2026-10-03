'use client';

import { MantineProvider } from "@mantine/core";
import theme from "@/styles/theme";

export default function MantineProviderWrapper({ children }: { children: React.ReactNode }) {
  return <MantineProvider theme={theme}>{children}</MantineProvider>;
}