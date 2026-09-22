import { z } from "zod";

export const IDSchema = z.object({
  id: z.string().min(1),
})
export type ID = z.infer<typeof IDSchema>;

export type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;
export type DistributiveKeyof<T> = T extends T ? keyof T : never
export type NonEmptyArray<T> = [T, ...T[]]
export type Nullable<T> = { [K in keyof T]: T[K] | null; };
export type StrictExtract<T, U extends T> = Extract<T, U>;