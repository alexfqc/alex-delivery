import { FC } from "react";
import styles from "./header.module.css";
import Logo from "@/app/_components/logo/page";
import Link from "next/link";

const Header: FC = () => (
  <header className={styles.headerWrapper}>
    <div className={styles.headerContent}>
      <Link href="/">
        <Logo customClass={styles.headerLogo} />
      </Link>
    </div>
  </header>
);

export default Header;
