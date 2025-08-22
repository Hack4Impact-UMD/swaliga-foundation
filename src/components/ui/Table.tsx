import { useEffect, useState } from "react";
import styles from "./Table.module.css";
import Filter, { FilterCondition } from "../Filter";
import { FaChevronLeft, FaChevronRight, FaFilter } from "react-icons/fa";
import { ID } from "@/types/utils";

export interface Column<T extends ID> {
  name: string;
  getValue: (item: T) => React.ReactNode;
}

interface SelectOptions {
  selectedItemIds: string[];
  setSelectedItemIds: React.Dispatch<React.SetStateAction<string[]>>;
}

interface PaginationOptions {
  itemsPerPageOptions: number[];
  includeAllOption?: boolean;
}

interface TableProps<T extends ID> {
  items: T[];
  columns: Column<T>[];
  selectOptions?: SelectOptions;
  paginationOptions?: PaginationOptions;
  filterConditions?: FilterCondition<T>[];
}

export default function Table<T extends ID>(props: TableProps<T>) {
  const { columns, items, selectOptions, paginationOptions, filterConditions } =
    props;

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [numItemsPerPage, setNumItemsPerPage] = useState<number>(
    paginationOptions?.itemsPerPageOptions
      ? paginationOptions.itemsPerPageOptions[0]
      : items.length
  );
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [filteredItems, setFilteredItems] = useState<T[]>(items);
  
  const numPages = Math.ceil(filteredItems.length / numItemsPerPage);

  useEffect(() => {
    setFilteredItems(items);
    setCurrentPage(0);
  }, [items]);

  const handleSelect = (id: string, checked: boolean) => {
    if (!selectOptions) {
      return;
    }
    if (checked) {
      selectOptions.setSelectedItemIds((prev: string[]) => [
        ...new Set([...prev, id]),
      ]);
    } else {
      selectOptions.setSelectedItemIds((prev: string[]) =>
        prev.filter((itemId: string) => itemId !== id)
      );
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (!selectOptions) {
      return;
    }
    if (checked) {
      selectOptions.setSelectedItemIds(filteredItems.map((item: T) => item.id));
    } else {
      selectOptions.setSelectedItemIds([]);
    }
  };

  const handleNumItemsPerPageChange = (value: number) => {
    setNumItemsPerPage(value);
    setCurrentPage(0);
  };

  const toggleFilter = () => setIsFilterOpen((prev) => !prev);

  const onFilter = (filteredItems: T[]) => {
    setFilteredItems(filteredItems);
    if (selectOptions) {
      selectOptions.setSelectedItemIds([]);
    }
    setCurrentPage(0);
  };

  return (
    <div className={styles.container}>
      <div className={styles.tablePaginationContainer}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr className={styles.headerRow}>
                {selectOptions && (
                  <th className={`${styles.rowItem} ${styles.stickyCol}`}>
                    <input
                      type="checkbox"
                      checked={
                        selectOptions.selectedItemIds.length ===
                        filteredItems.length
                      }
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
              {filteredItems.length === 0 ? (
                <tr className={styles.tableRow}>
                  <td
                    className={styles.rowItem}
                    colSpan={columns.length + (selectOptions ? 1 : 0)}
                  >
                    No items to display
                  </td>
                </tr>
              ) : (
                filteredItems
                  .slice(
                    currentPage * numItemsPerPage,
                    Math.min(
                      filteredItems.length,
                      (currentPage + 1) * numItemsPerPage
                    )
                  )
                  .map((item: T) => {
                    const checked = selectOptions?.selectedItemIds?.includes(
                      item.id
                    );
                    return (
                      <tr
                        className={
                          checked ? styles.selectedTableRow : styles.tableRow
                        }
                      >
                        {selectOptions && (
                          <td
                            className={`${styles.rowItem} ${styles.stickyCol}`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) =>
                                handleSelect(item.id, e.target.checked)
                              }
                            />
                          </td>
                        )}
                        {columns.map((column: Column<T>) => (
                          <td className={styles.rowItem}>
                            {column.getValue(item)}
                          </td>
                        ))}
                      </tr>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>
        {paginationOptions && (
          <div className={styles.pagination}>
            <div className={styles.paginationElement}>
              <label>Items per page: </label>
              <select
                value={numItemsPerPage}
                onChange={(e) =>
                  handleNumItemsPerPageChange(Number(e.target.value))
                }
              >
                {paginationOptions.itemsPerPageOptions.map((option: number) => (
                  <option value={option}>{option}</option>
                ))}
                {paginationOptions.includeAllOption && (
                  <option value={items.length}>All</option>
                )}
              </select>
            </div>
            <span className={styles.paginationElement}>
              {filteredItems.length === 0
                ? 0
                : currentPage * numItemsPerPage + 1}
              -
              {Math.min(
                filteredItems.length,
                (currentPage + 1) * numItemsPerPage
              )}{" "}
              of {filteredItems.length}
            </span>
            <div className={styles.paginationElement}>
              <button
                className={styles.pageButton}
                disabled={currentPage === 0}
                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              >
                <FaChevronLeft size={15} />
              </button>
              <button
                className={styles.pageButton}
                disabled={currentPage === numPages - 1}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(numPages - 1, prev + 1))
                }
              >
                <FaChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
      {filterConditions && (
        <div className={styles.filterContainer}>
          <div hidden={!isFilterOpen}>
            <Filter
              items={items}
              onFilter={onFilter}
              onClose={toggleFilter}
              filterConditions={filterConditions}
            />
          </div>
          <div hidden={isFilterOpen}>
            <FaFilter
              className={styles.filterIcon}
              size={20}
              onClick={toggleFilter}
            />
          </div>
        </div>
      )}
    </div>
  );
}
