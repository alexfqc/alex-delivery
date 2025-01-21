import { FC } from "react";
import styles from "./page.module.css";

const Home: FC = () => {
  return (
    <div className={styles.appWrapper}>
      <div className={styles.appContent}>
        <div className={styles.appWelcomeMessage}>
          Welcome to Alex Delivery&apos;s App
        </div>
        <div className={styles.appDescriptionText}>
          This an app that helps you order food restaurants using AI. Try typing
          &quot;what are the available restaurants&quot; to get started.
        </div>
      </div>
    </div>
  );
};

export default Home;
