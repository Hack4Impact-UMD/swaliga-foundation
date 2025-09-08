import React from 'react';
import styles from './Page.module.css';

interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Page(props: PageProps) {
  const { children, className, ...rest } = props;
  return <div className={`${styles.page} ${className}`} {...rest}>{children}</div>;
}