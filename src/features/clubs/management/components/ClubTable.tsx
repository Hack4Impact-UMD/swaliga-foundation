import { Club } from "@/types/club-types";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import clubListQueryOptions from "../hooks/clubListQueryOptions";
import { Table } from "@mantine/core";
import styles from "../../../../components/ui/table/Table.module.css";

export default function ClubTable() {
  const clubListQuery = useSuspenseInfiniteQuery(clubListQueryOptions());

  const features = tableFeatures({});
  const clubColumnHelper = createColumnHelper<typeof features, Club>();
  const clubColumns = clubColumnHelper.columns([
    clubColumnHelper.accessor("name", {
      header: "Name",
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
    }),
    clubColumnHelper.accessor("address", {
      header: "Address",
      cell: (info) => {
        const { addressLine1, addressLine2, city, state, country, zipCode } = info.getValue();
        return `${addressLine1}${addressLine2 ? ` ${addressLine2}` : ''} ${city}, ${state}, ${country} ${zipCode}`
      },
      footer: (info) => info.column.id,
    }),
  ]);

  const clubTable = useTable({
    features,
    columns: clubColumns,
    data: clubListQuery.data,
  });

  return (
    <Table className={styles.table}>
      <Table.Thead className={styles.tableHead}>
        {clubTable.getHeaderGroups().map((headerGroup) => (
          <Table.Tr className={styles.headerRow}>
            {headerGroup.headers.map((header) => (
              <Table.Th>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </Table.Th>
            ))}
          </Table.Tr>
        ))}
      </Table.Thead>
      <Table.Tbody>
        {clubTable.getRowModel().rows.map((row) => (
          <Table.Tr className={styles.tableRow}>
            {row.getAllCells().map((cell) => (
              <Table.Td>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Table.Td>
            ))}
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
