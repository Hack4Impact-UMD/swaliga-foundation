'use client';

import { getEnvironment } from "@/utils/envUtils";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { formDevtoolsPlugin } from "@tanstack/react-form-devtools";

export default function TanstackDevtoolsWrapper() {
  return getEnvironment() !== "production" && <TanStackDevtools plugins={[formDevtoolsPlugin()]} />
}