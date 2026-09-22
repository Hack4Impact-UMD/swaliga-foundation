"use client";

import clubListQueryOptions from "@/features/clubs/management/hooks/clubListQueryOptions";
import { Club } from "@/types/club-types";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

const clubsData: Club[] = [
  {
    clubId: "123",
    address: {
      addressLine1: "123 Main St",
      city: "Anytown",
      state: "CA",
      country: "USA",
      zipCode: 12345
    },
    name: "Test Club"
  },
    {
    clubId: "456",
    address: {
      addressLine1: "400 Smth Ave",
      city: "Washington",
      state: "DC",
      country: "USA",
      zipCode: 54321
    },
    name: "New Club"
  }
];


export default function ClubsPage() {
  const clubListQuery = useSuspenseInfiniteQuery(clubListQueryOptions());

  console.log(clubListQuery);

  return <></>;
}
