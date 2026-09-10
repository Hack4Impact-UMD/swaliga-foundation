'use client';

import { queryClient } from "@/config/tanstackQuery";
import { QueryClientProvider } from "@tanstack/react-query";

export default function QueryClientProviderWrapper({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}