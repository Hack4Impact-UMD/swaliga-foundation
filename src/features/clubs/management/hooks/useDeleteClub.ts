import { deleteClubDoc } from "@/data/firestore/clubs";
import { ClubSchema } from "@/types/club-types";
import { useMutation } from "@tanstack/react-query";
import z from "zod";

const DeleteClubRequestSchema = ClubSchema.pick({ clubId: true });
type DeleteClubRequest = z.infer<typeof DeleteClubRequestSchema>;

async function deleteClub(req: DeleteClubRequest) {
  DeleteClubRequestSchema.parse(req);
  const { clubId } = req;
  await deleteClubDoc(clubId);
}

export default function useDeleteClub() {
  return useMutation({ mutationFn: deleteClub });
}