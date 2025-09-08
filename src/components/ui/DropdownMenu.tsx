import { DropdownMenu as RadixDropdownMenu } from "radix-ui";
import styles from "./DropdownMenu.module.css";

function Root(props: RadixDropdownMenu.DropdownMenuProps) {
  return <RadixDropdownMenu.Root {...props} />;
}

function Trigger(props: RadixDropdownMenu.DropdownMenuTriggerProps) {
  const { className, ...rest } = props;
  return <RadixDropdownMenu.Trigger className={`${styles.trigger} ${className}`} {...rest} />;
}

function Content(props: RadixDropdownMenu.DropdownMenuContentProps) {
  const { className, ...rest } = props;
  return <RadixDropdownMenu.Content className={`${styles.content} ${className}`} {...rest} />;
}

function Item(props: RadixDropdownMenu.DropdownMenuItemProps) {
  const { className, ...rest } = props;
  return <RadixDropdownMenu.Item className={`${styles.item} ${className}`} {...rest} />;
}

export const DropdownMenu = { Root, Trigger, Content, Item };
