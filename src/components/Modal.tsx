import styles from './Modal.module.css';

export default function Modal(props: { children: JSX.Element }) {
    return (
      <div className={styles.modalBackground}>
        <dialog className={styles.modal} open>
          {props.children}
        </dialog>
      </div>
    );
}