import { FC } from "react";
import styles from "./notFound.module.css";
import Logo from "./_components/logo/page";
import Link from "next/link";

const NotFound: FC = () => (
  <div className={styles.notFoundWrapper}>
    <Logo />
    <div className={styles.text}>Food not found</div>
    <Link href="/" className={styles.homeLink}>
      Go Home
    </Link>
  </div>
);

export default NotFound;
