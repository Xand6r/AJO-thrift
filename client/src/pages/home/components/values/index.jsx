import React from 'react';
import  {
    Completeness,
    Purity,
    Confidence
} from './assets';
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
        <h2>Coco-pure</h2>
        <section className={styles.value_list}>
            <div>
                <Completeness />
                <h4>Completeness</h4>
            </div>
            <div>
                <Confidence />
                <h4>Confidence</h4>
            </div>
            <div>
                <Purity />
                <h4>Purity</h4>
            </div>
        </section>
        <h5>
            We&apos;re happy when your hair and skin are happy. This happiness comes from confidence in our promise of real and natural results for you. Our coco-pure values ensure we always keep it. coco-pure! Completeness, Confidence, and Purity.
        </h5>
      </div>
    </div>
  );
}
