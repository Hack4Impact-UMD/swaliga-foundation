import styles from "./Footer.module.css";
import logo from "@/../public/swaliga-website-logo.png";
import h4ILogo from "@/../public/h4ILogo.png";
import Link from "next/link";
import Image from "next/image";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.logoSocialsColumn}>
        <Link href="https://swaligafoundation.org/" target="_blank">
          <Image
            src={logo.src}
            alt="Swaliga Foundation Logo"
            className={styles.logo}
            width={400}
            height={63}
          />
        </Link>
        <div className={styles.socials}>
          <Link href="https://www.facebook.com/TheSwaligaFoundation/">
            <FaFacebook className={styles.socialIcon} />
          </Link>
          <Link href="https://www.instagram.com/tribeswaliga/">
            <FaInstagram className={styles.socialIcon} />
          </Link>
          <Link href="https://www.linkedin.com/company/swaliga-foundation/">
            <FaLinkedin className={styles.socialIcon} />
          </Link>
          <Link href="https://www.youtube.com/user/TribeSwaliga">
            <FaYoutube className={styles.socialIcon} />
          </Link>
          <Link href="https://x.com/tribeswaliga">
            <FaTwitter className={styles.socialIcon} />
          </Link>
        </div>
      </div>
      <div className={styles.contactInfoColumn}>
        <p className={styles.contactHeader}>Contact Us</p>
        <p className={styles.contactInfo}>
          <span>Address: </span>
          <br />
          400 Massachusetts Avenue NW
          <br />
          Washington, D.C. 20001
        </p>
        <p className={styles.contactInfo}>
          <span>Phone: </span>(301) 452-7716
        </p>
        <p className={styles.contactInfo}>
          <span>Email: </span>
          <a
            href={`mailto:${"info@swaligafoundation.org"}`}
            className={styles.linkText}
          >
            info@swaligafoundation.org
          </a>
        </p>
      </div>
      <Link
        className={styles.linkText}
        href="https://umd.hack4impact.org/ourwork/swaliga"
        target="_blank"
      >
        <div className={styles.h4iColumn}>
          <p>
            Built By<br />Hack4Impact-UMD
          </p>
          <Image
            src={h4ILogo.src}
            alt="Hack4Impact-UMD Logo"
            width={100}
            height={100}
            className="h-[32px]"
          />
        </div>
      </Link>
    </footer>
  );
}
