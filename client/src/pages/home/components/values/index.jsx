import React from "react";
import { Completeness, Purity, Confidence } from "./assets";
import FemaleImage from "../../../../assets/female.png";
import styles from "./values.module.scss";

export default function index() {
  return (
    <div className={styles.values}>
      <div className={styles.imagewrapper}>
        <img alt="femaleimage" src={FemaleImage} />
      </div>
      <div className={styles.textwrapper}>
        <p>OUR VALUES</p>
        <h2>The Cooperative</h2>
        <section className={styles.value_list}>
          <div>
            <Completeness />
            <h4>Fairness</h4>
          </div>
          <div>
            <Confidence />
            <h4>Decentralisation</h4>
          </div>
          <div>
            <Purity />
            <h4>Privacy</h4>
          </div>
        </section>
        <h5>
          A cooperative is created by specifying the:
          <ul>
            <li>A desired number of participants(minimum of 3).</li>
            <li>
              A specified duration(in days) which is the length of each
              'deposit-claim' cycle.
            </li>
            <li>
              a specified amount(in Wei) which is the amount each depositor is
              to contribute.
            </li>
          </ul>
          The total life-span of each created cooperative is the specified
          duration multiplied by the total number of participants.
        </h5>
      </div>
    </div>
  );
}
