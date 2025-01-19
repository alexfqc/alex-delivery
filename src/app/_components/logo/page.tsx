import React from "react";
import styles from "./logo.module.css";
import { Bebas_Neue } from "next/font/google";

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas-neue",
  subsets: ["latin"],
});

const Logo = ({
  customClass = "",
}: {
  customClass?: string;
}): React.ReactNode => {
  return (
    <div
      className={`${bebasNeue.className} ${styles.logoWrapper} ${customClass}`}
    >
      <div>Alex</div>
      <div>Delivery</div>
    </div>
  );
};

export default Logo;
