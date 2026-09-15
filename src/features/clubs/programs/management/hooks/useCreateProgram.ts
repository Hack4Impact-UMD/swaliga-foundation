import { ProgramSchema } from "@/types/club-types";
import { useMutation } from "@tanstack/react-query";
import z from "zod";

const CreateProgramRequestSchema = ProgramSchema.omit({
  programId: true,
  studentIds: true,
  teacherIds: true,
  staffIds: true
});
type CreateProgramRequest = z.infer<typeof CreateProgramRequestSchema>;

async function createProgram(req: CreateProgramRequest) {
  CreateProgramRequestSchema.parse(req);
  const { name } = req;
  // @ts-ignore
}

export default function useCreateProgram() {
  return useMutation({ mutationFn: createProgram });
}