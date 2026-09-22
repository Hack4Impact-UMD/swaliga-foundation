import { Suspense } from "react";
import LoadingPage from "../loading";
import ClubsPage from "./ClubsPage";

export default function ClubsRoute() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <ClubsPage />
    </Suspense>
  );
}
