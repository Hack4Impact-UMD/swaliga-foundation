import { getProgramDoc } from "@/data/firestore/programs";
import { queryOptions } from "@tanstack/react-query";

type ProgramIdentifier = {
  programId: string;
  clubId: string;
}

export default function programQueryOptions(req: ProgramIdentifier) {
  const { programId, clubId } = req;
  return queryOptions({
    queryKey: ["clubs", clubId, "programs", "detail", programId],
    queryFn: async () => getProgramDoc(programId, clubId)
  })
}