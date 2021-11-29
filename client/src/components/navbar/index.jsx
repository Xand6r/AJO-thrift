import React from "react";
import ConnectButton from "../../components/connect";
import styles from "./navbar.module.scss";

const walletAddress = false;

export default function Index() {
  const walletButtomClass = walletAddress ? "--active" : "";
  return (
    <nav className={styles.header}>
      {/* logo on big screens */}
      <div className={styles.header__logo__big}>
        <h2>THE COOPERATIVE</h2>
      </div>

      {/* logo on small screens */}
      <div className={styles.header__logo__small}>
        <h4>THE COOPERATIVE</h4>
      </div>

      {/* metmask icon */}
      <ConnectButton />
      {/* metmask icon */}
    </nav>
  );
}
