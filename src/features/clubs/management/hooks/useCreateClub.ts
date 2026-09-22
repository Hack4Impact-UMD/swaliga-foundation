import { setClubDoc } from "@/data/firestore/clubs";
import { ClubSchema } from "@/types/club-types";
import { useMutation } from "@tanstack/react-query";
import { v4 } from "uuid";
import z from "zod";

const CreateClubRequestSchema = ClubSchema.omit({
  clubId: true
});
type CreateClubRequest = z.infer<typeof CreateClubRequestSchema>;

async function createClub(req: CreateClubRequest) {
  CreateClubRequestSchema.parse(req);
  const clubId = v4();
  await setClubDoc(clubId, req);
  return clubId;
}

export default function useCreateClub() {
  return useMutation({
    mutationFn: createClub,
  })
}