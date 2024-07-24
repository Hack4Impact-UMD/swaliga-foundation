import { useState } from "react";
import styles from "./Table.module.css";
import Filter, { FilterCondition } from "./Filter";
import { FaFilter } from "react-icons/fa";

export interface Column<T> {
  id: string,
  name: string,
  getValue: (item: T) => JSX.Element;
}

export interface Item<T> {
  id: string;
  data: T;
}

interface TableProps<T> {
  columns: Column<T>[];
  items: Item<T>[];
  selectedItemIds?: string[];
  filterConditions: FilterCondition<T>[];
  filterFunction: (item: T, filterConditions: { [key: string]: any }) => boolean;
  setSelectedItemIds?: (ids: string[]) => void;
}

export default function Table<T>(props: TableProps<T>) {
  const { columns, items, selectedItemIds, filterConditions, filterFunction, setSelectedItemIds } = props;
  const [filteredItems, setFilteredItems] = useState<Item<T>[]>(items);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const itemsPerPage = 50;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const toggleSelectAll = () => {
    if (!selectedItemIds || !setSelectedItemIds) {
      return;
    } else if (selectedItemIds.length === 0) {
      setSelectedItemIds(items.map((item) => item.id));
    } else {
      setSelectedItemIds([]);
    }
  }

  const handleStudentCheck = (id: string) => {
    if (!selectedItemIds || !setSelectedItemIds) {
      return;
    } else if (selectedItemIds.includes(id)) {
      setSelectedItemIds(selectedItemIds.filter((studentId) => studentId !== id));
    } else {
      setSelectedItemIds([...selectedItemIds, id]);
    }
  }

  return (
    <>
      <div className={styles.content}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                {selectedItemIds && <th>
                  <input
                    type="checkbox"
                    checked={selectedItemIds.length !== 0}
                    onChange={toggleSelectAll}
                  />
                </th>}
                {columns.map((column) => (
                  <th key={column.id}>{column.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredItems
                .slice(
                  currentPage * itemsPerPage,
                  (currentPage + 1) * itemsPerPage
                )
                .map((item) => (
                  <tr
                    key={item.id}
                    className={
                      selectedItemIds && selectedItemIds.includes(item.id) ? styles.checkedRow : ""
                    }
                  >
                    {selectedItemIds && <td>
                      <input
                        type="checkbox"
                        checked={selectedItemIds.includes(item.id)}
                        onChange={() => handleStudentCheck(item.id)}
                      />
                    </td>}
                    {columns.map((column) => <td>{column.getValue(item.data)}</td>)} 
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className={styles.filterContainer}>
          {isFilterOpen ? (
            <Filter
              filterConditions={filterConditions}
              items={items}
              closeFilter={() => setIsFilterOpen(false)}
              setFilteredItems={setFilteredItems}
              filterFunction={filterFunction}
            />
          ) : (
            <div className={styles.filterBox} onClick={() => setIsFilterOpen(true)}>
              <FaFilter className={styles.filterIcon} />
            </div>
          )}
        </div>
      </div>
      <div className={styles.pagination}>
        <button
          className={styles.paginationButton}
          onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
        >
          Previous 50 Students
        </button>
        <button
          className={styles.paginationButton}
          onClick={() =>
            setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
          }
          disabled={currentPage >= totalPages - 1}
        >
          Next 50 Students
        </button>
      </div>
    </>
  )
}