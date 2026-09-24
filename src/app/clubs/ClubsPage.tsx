"use client";

import clubListQueryOptions from "@/features/clubs/management/hooks/clubListQueryOptions";
import { Club } from "@/types/club-types";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { createColumnHelper, tableFeatures, useTable } from "@tanstack/react-table";

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

  const features = tableFeatures({});
  const clubColumnHelper = createColumnHelper<typeof features, Club>();
  const clubColumns = clubColumnHelper.columns([
    clubColumnHelper.accessor("name", {
      header: "Name",
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id
    }),
    clubColumnHelper.accessor("address", {
      header: "Address",
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id
    })
  ]);

  const clubsTable = useTable({
    features,
    columns: clubColumns,
    data: clubListQuery.data,
  })

  return <></>;
}