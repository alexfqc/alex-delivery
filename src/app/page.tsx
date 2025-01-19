import { FC } from "react";
import styles from "./page.module.css";

const Home: FC = () => {
  return (
    <div className={styles.appWrapper}>
      <div className={styles.appContent}>app</div>
    </div>
  );
};

export default Home;
