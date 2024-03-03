import Image from "next/image";
import Login from './login';
import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Login/>
    </div>
  )
}
