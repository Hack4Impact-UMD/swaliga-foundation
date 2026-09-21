import { getClubById } from "@/data/firestore/clubs";
import { queryOptions } from "@tanstack/react-query";

type ClubIdentifier = {
  clubId: string;
}

export default function clubQueryOptions(req: ClubIdentifier) {
  const { clubId } = req;
  return queryOptions({
    queryKey: ["clubs", "detail", clubId],
    queryFn: async () => getClubById(clubId)
  })
}