import { IconBaseProps, IconType } from "react-icons/lib";
import styles from "./MenuIcon.module.css";
import { Tooltip } from "@/components/ui/Tooltip";

interface MenuIconProps extends IconBaseProps {
  icon: IconType;
}

export default function MenuIcon(props: MenuIconProps) {
  const { icon, size, className, title, ...rest } = props;

  const iconElement = icon({
    className: `${styles.icon} ${className}`,
    size: size ?? 30,
    ...rest,
  });

  return title ? (
    <Tooltip.Root>
      <Tooltip.Trigger>{iconElement}</Tooltip.Trigger>
      <Tooltip.Content>{title}</Tooltip.Content>
    </Tooltip.Root>
  ) : (
    iconElement
  );
}
