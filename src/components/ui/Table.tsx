import { useState } from "react";
import styles from "./Table.module.css";
import Filter, { FilterCondition } from "../Filter";
import { FaFilter } from "react-icons/fa";
import { ID } from "@/types/utils";

export interface Column<T extends ID> {
  name: string;
  getValue: (item: T) => React.ReactNode;
}

interface SelectOptions {
  selectedItemIds: string[];
  setSelectedItemIds: React.Dispatch<React.SetStateAction<string[]>>;
}

interface TableProps<T extends ID> {
  columns: Column<T>[];
  items: T[];
  selectOptions?: SelectOptions;
  filterConditions?: FilterCondition<T>[];
  filterFunction?: (
    item: T,
    filterConditions: { [key: string]: any }
  ) => boolean;
}

export default function Table<T extends ID>(props: TableProps<T>) {
  const { columns, items, selectOptions } = props;
  // @ts-ignore
  const { selectedItemIds, setSelectedItemIds } = selectOptions;

  const [currentPage, setCurrentPage] = useState<number>(0);
  const itemsPerPage = 50;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const handleSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItemIds((prev: string[]) => [...new Set([...prev, id])]);
    } else {
      setSelectedItemIds((prev: string[]) =>
        prev.filter((itemId: string) => itemId !== id)
      );
    }
  };

  const handleSelectAll = (checked: boolean) => {
    items.forEach((item: T) => handleSelect(item.id, checked));
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.headerRow}>
          {selectOptions && (
            <th className={styles.rowItem}>
              <input
                type="checkbox"
                checked={selectedItemIds.length === items.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </th>
          )}
          {columns.map((column: Column<T>) => (
            <th className={styles.rowItem}>{column.name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map((item: T) => {
          const checked = selectOptions && selectedItemIds?.includes(item.id);
          return (
            <tr className={checked ? styles.selectedTableRow : styles.tableRow}>
              {selectOptions && (
                <td className={styles.rowItem}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => handleSelect(item.id, e.target.checked)}
                  />
                </td>
              )}
              {columns.map((column: Column<T>) => (
                <td className={styles.rowItem}>{column.getValue(item)}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        
      </tfoot>
    </table>
  );
}
