"use client";

import React, { useState } from 'react';
import styles from './Filter.module.css';

interface FilterProps<T> {
  filterConditions: FilterCondition<T>[];
  items: T[],
  closeFilter: () => void,
  setFilteredItems: (items: T[]) => void;
  filterFunction: (item: T, filterValues: { [key: string]: any }) => boolean;
}

export interface FilterCondition<T> {
  id: string;
  name: string;
  inputType: string;
}

export default function Filter<T>(props: FilterProps<T>) {
  const { filterConditions, items, closeFilter, setFilteredItems, filterFunction } = props;
  const [filterValues, setFilterValues] = useState<{ [key: string]: any }>({});

  return (
    <div className={styles.container}>
      <div className={styles.closeIcon} onClick={closeFilter} />
      {filterConditions.map((condition) => (
        <input
          key={condition.id}
          name={condition.id}
          className={styles.inputField}
          type={condition.inputType}
          placeholder={condition.name}
          value={filterValues[condition.id]}
          onChange={(ev) => setFilterValues({ ...filterValues, [condition.id]: ev.target.value })}
        />
      ))}
      <button className={styles.button} onClick={() => setFilteredItems(items.filter((item: T) => filterFunction(item, filterValues)))}> APPLY </button>
    </div>
  );
}