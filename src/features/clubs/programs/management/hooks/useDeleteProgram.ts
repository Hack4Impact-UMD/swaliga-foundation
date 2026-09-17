import { deleteProgramDoc } from "@/data/firestore/programs";
import { ProgramSchema } from "@/types/club-types";
import { useMutation } from "@tanstack/react-query";
import z from "zod";

const DeleteProgramRequestSchema = ProgramSchema.pick({ clubId: true, programId: true });
type DeleteProgramRequest = z.infer<typeof DeleteProgramRequestSchema>;

async function deleteProgram(req: DeleteProgramRequest) {
  DeleteProgramRequestSchema.parse(req);
  const { clubId, programId } = req;
  await deleteProgramDoc(programId, clubId);
}

export default function useDeleteProgram() {
  return useMutation({ mutationFn: deleteProgram });
}