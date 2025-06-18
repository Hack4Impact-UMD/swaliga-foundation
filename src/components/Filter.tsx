"use client";

import React, { useCallback, useState } from "react";
import styles from "./Filter.module.css";

interface FilterProps<T> {
  items: T[];
  setFilteredItems: React.Dispatch<React.SetStateAction<T[]>>;
  onClose: () => void;
  filterConditions: FilterCondition<T>[];
}

export interface FilterCondition<T> {
  name: string;
  getItemValue: (item: T) => string;
}

export default function Filter<T>(props: FilterProps<T>) {
  const { filterConditions, items, onClose, setFilteredItems } =
    props;
  const [filterValues, setFilterValues] = useState<{ [key: string]: any }>({});

  const compFunc = useCallback((itemVal: string, filterVal: string) => {
    return itemVal.toLowerCase().includes(filterVal.toLowerCase());
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
          setFilteredItems(
            items.filter((item: T) =>
              filterConditions.every((condition: FilterCondition<T>) =>
                compFunc(
                  condition.getItemValue(item),
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
