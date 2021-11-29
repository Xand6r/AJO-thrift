import React from "react";
import MetaMask from "../../assets/metamask.svg";
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
      <div className={styles.metamask__window}>
        <button
          id={styles.walletButton}
          className={walletButtomClass}
        //   onClick={connectWalletPressed}
        >
          <img src={MetaMask} />
          {/* {walletAddress.length > 0 ? (
            formatAddress()
          ) : (
            <span>Connect Wallet</span>
            )} */}
          <span>Connect Wallet</span>
        </button>
      </div>
      {/* metmask icon */}
    </nav>
  );
}
