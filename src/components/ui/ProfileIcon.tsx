import useAuth from "@/features/auth/authN/components/useAuth";
import styles from "./ProfileIcon.module.css";
import { ActionIcon, ActionIconProps, Image } from "@mantine/core";
import { ComponentPropsWithRef } from "react";

interface ProfileIconProps extends Omit<ActionIconProps, "size">, Omit<ComponentPropsWithRef<"button">, keyof ActionIconProps> {
  size?: number;
}

export default function ProfileIcon({ size = 35, ref, ...others }: ProfileIconProps) {
  const auth = useAuth();
  if (!auth) {
    return <></>;
  }

  const photoURL = auth.user?.photoURL;
  if (photoURL) {
    return (
      <ActionIcon size="xl" color="transparent" ref={ref} {...others}>
        <Image
          src={photoURL}
          alt="Profile Picture"
          className={styles.profileImage}
          width={size}
          height={size}
        />
      </ActionIcon>
    );
  }

  const initials = auth.user?.displayName
    ?.split(" ")[0][0]
    .toUpperCase() ?? "G";

  return (
    <ActionIcon size="xl" color="transparent" ref={ref} {...others} classNames={{
      root: styles.profileIcon
    }}>
      <div className={styles.profileIcon} style={{ width: size, height: size, fontSize: `${size * 3 / 70}em` }}>{initials}</div>
    </ActionIcon>
  );  
}