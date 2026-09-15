import { updateClubDoc } from "@/data/firestore/clubs";
import { ClubSchema } from "@/types/club-types";
import { useMutation } from "@tanstack/react-query";
import z from "zod";

const UpdateClubRequestSchema = ClubSchema.omit({ clubId: true }).partial().extend(ClubSchema.pick({ clubId: true }).shape);
type UpdateClubRequest = z.infer<typeof UpdateClubRequestSchema>;

async function updateClub(req: UpdateClubRequest) {
  UpdateClubRequestSchema.parse(req);
  const { clubId, ...rest } = req;
  await updateClubDoc(clubId, rest);
}

export default function useUpdateClub() {
  return useMutation({ mutationFn: updateClub });
}