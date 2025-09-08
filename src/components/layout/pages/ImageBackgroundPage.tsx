import styles from './ImageBackgroundPage.module.css';
import Page from "./Page";

interface ImageBackgroundPageProps {
  children: React.ReactNode;
}

export default function ImageBackgroundPage(props: ImageBackgroundPageProps) {
  const { children } = props;
  return <Page className={styles.imageBackgroundPage}>{children}</Page>
}