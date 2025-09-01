import { IconBaseProps, IconType } from "react-icons/lib";
import styles from './MenuIcon.module.css';

interface MenuIconProps extends IconBaseProps {
  icon: IconType;
}

export default function MenuIcon(props: MenuIconProps) {
  const { icon, size, className, ...rest } = props;
  return icon({
    className: `${styles.icon} ${className}`,
    size: size ?? 30,
    ...rest
  })
}