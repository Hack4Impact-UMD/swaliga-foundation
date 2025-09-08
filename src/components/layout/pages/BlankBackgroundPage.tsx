import styles from './BlankBackgroundPage.module.css';
import Page from "./Page";

interface BlankBackgroundPageProps {
  children: React.ReactNode;
  backgroundColor?: string;
}

export default function BlankBackgroundPage(props: BlankBackgroundPageProps) {
  const { children, backgroundColor } = props;
  return <Page className={styles.blankBackgroundPage} style={{ backgroundColor }}>{children}</Page>
}