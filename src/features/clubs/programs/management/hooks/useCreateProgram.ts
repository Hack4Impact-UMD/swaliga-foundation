import { setProgramDoc } from "@/data/firestore/programs";
import { ProgramSchema } from "@/types/club-types";
import { useMutation } from "@tanstack/react-query";
import { v4 } from "uuid";
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
  await setProgramDoc({
    programId: v4(),
    ...req,
    studentIds: [],
    teacherIds: [],
    staffIds: []
  });
}

export default function useCreateProgram() {
  return useMutation({ mutationFn: createProgram });
}