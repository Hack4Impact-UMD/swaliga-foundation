import useAuth from "@/features/auth/authN/components/useAuth";
import styles from "./ProfileIcon.module.css";
import Image from "next/image";

interface ProfileIconProps {
  size?: number;
}

export default function ProfileIcon({ size = 35 }: ProfileIconProps) {
  const auth = useAuth();
  const photoURL = auth.user?.photoURL;
  const initials = auth.user?.displayName
    ?.split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  return photoURL ? (
    <Image
      src={photoURL}
      alt="Profile Picture"
      className={styles.profileImage}
      width={size}
      height={size}
    />
  ) : (
    <div className={styles.profileIcon} style={{ width: size, height: size, fontSize: `${size * 3 / 70}em` }}>{initials}</div>
  );
}
