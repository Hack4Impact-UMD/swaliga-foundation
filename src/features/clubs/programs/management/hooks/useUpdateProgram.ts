import { updateProgramDoc } from "@/data/firestore/programs";
import { ProgramSchema } from "@/types/club-types";
import { useMutation } from "@tanstack/react-query";
import z from "zod";

const UpdateProgramRequestSchema = ProgramSchema.omit({
  clubId: true,
  programId: true,
  studentIds: true,
  staffIds: true,
  teacherIds: true,
}).partial().extend(ProgramSchema.pick({ clubId: true, programId: true }).shape);
type UpdateProgramRequest = z.infer<typeof UpdateProgramRequestSchema>;

async function updateProgram(req: UpdateProgramRequest) {
  UpdateProgramRequestSchema.parse(req);
  const { clubId, programId, ...rest } = req;
  await updateProgramDoc(programId, clubId, rest);
}

export default function useUpdateProgram() {
  return useMutation({ mutationFn: updateProgram });
}