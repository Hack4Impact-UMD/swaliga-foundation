"use client";

import React, { useCallback, useState } from "react";
import styles from "./Filter.module.css";

interface FilterProps<T> {
  items: T[];
  onFilter: (filteredItems: T[]) => void;
  onClose: () => void;
  filterConditions: FilterCondition<T>[];
}

export interface FilterCondition<T> {
  name: string;
  getValue: (item: T) => string;
}

export default function Filter<T>(props: FilterProps<T>) {
  const { filterConditions, items, onClose, onFilter } = props;
  const [filterValues, setFilterValues] = useState<{ [key: string]: any }>({});

  const compFunc = useCallback((itemVal: string, filterVal: string) => {
    return itemVal.toLowerCase().includes(filterVal.toLowerCase().trim());
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.closeIcon} onClick={onClose} />
      {filterConditions.map((condition) => (
        <input
          key={condition.name}
          name={condition.name}
          className={styles.inputField}
          type="text"
          placeholder={condition.name}
          value={filterValues[condition.name] || ""}
          onChange={(ev) =>
            setFilterValues({
              ...filterValues,
              [condition.name]: ev.target.value,
            })
          }
        />
      ))}
      <button
        className={styles.button}
        onClick={() =>
          onFilter(
            items.filter((item: T) =>
              filterConditions.every((condition: FilterCondition<T>) =>
                compFunc(
                  condition.getValue(item),
                  filterValues[condition.name] || ""
                )
              )
            )
          )
        }
      >
        APPLY
      </button>
    </div>
  );
}
