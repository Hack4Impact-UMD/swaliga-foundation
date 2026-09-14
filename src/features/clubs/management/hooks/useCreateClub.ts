import { setClubDoc } from "@/data/firestore/clubs";
import { ClubSchema } from "@/types/club-types";
import { useMutation } from "@tanstack/react-query";
import z from "zod";

const CreateClubRequestSchema = ClubSchema.pick({
  name: true,
  //address: true
});

type CreateClubRequest = z.infer<typeof CreateClubRequestSchema>;

async function createClub(req: CreateClubRequest) {
  CreateClubRequestSchema.parse(req);
  const { name } = req;
  // @ts-ignore
  setClubDoc({ name })
}

export default function useCreateClub() {
  return useMutation({
    mutationFn: createClub,
  })
}