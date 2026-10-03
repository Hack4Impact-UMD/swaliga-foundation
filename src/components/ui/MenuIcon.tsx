import { ActionIcon, Tooltip } from "@mantine/core";

interface MenuIconProps {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export default function MenuIcon(props: MenuIconProps) {
  const { label, children, onClick } = props;
  return (
    <Tooltip label={label} onClick={onClick}>
      <ActionIcon>
        {children}
      </ActionIcon>
    </Tooltip>
  );
}