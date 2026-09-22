"use client";

import clubListQueryOptions from "@/features/clubs/management/hooks/clubListQueryOptions";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

export default function ClubsPage() {
  const clubListQuery = useSuspenseInfiniteQuery(clubListQueryOptions());

  console.log(clubListQuery);

  return <></>;
}
