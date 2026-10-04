import { ActionIcon, Tooltip } from "@mantine/core";
import styles from "./MenuIcon.module.css";

interface MenuIconProps {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export default function MenuIcon(props: MenuIconProps) {
  const { label, children, onClick } = props;
  return (
    <Tooltip label={label} onClick={onClick} classNames={{ tooltip: styles.tooltip }}>
      <ActionIcon size="xl" classNames={{ root: styles.actionIconRoot }}>
        {children}
      </ActionIcon>
    </Tooltip>
  );
}
