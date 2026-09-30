import { z } from "zod";

const ENVIRONMENTS = ["development", "production"] as const;
const EnvironmentSchema = z.enum(ENVIRONMENTS);
type Environment = z.infer<typeof EnvironmentSchema>;

export function getEnvironment(): Environment {
  const nodeEnvValidation = EnvironmentSchema.safeParse(process.env.NODE_ENV);
  if (nodeEnvValidation.success) {
    return nodeEnvValidation.data;
  }

  const nextPublicNodeEnvValidation = EnvironmentSchema.safeParse(process.env.NEXT_PUBLIC_NODE_ENV);
  if (nextPublicNodeEnvValidation.success) {
    return nextPublicNodeEnvValidation.data;
  }

  throw Error("Unable to determine environment");
}