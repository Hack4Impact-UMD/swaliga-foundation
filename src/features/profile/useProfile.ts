import { useContext } from "react";
import { ProfileContext } from "./ProfileProvider";

export default function useProfile() {
  return useContext(ProfileContext);
}
