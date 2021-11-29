import React, { useState } from 'react';

import BgCream from '../../../../assets/small-landingbackground.png'

import LeftArrow from "../../../../assets/leftarrow.svg";
import styles from "./landing.module.scss";



export default function Index() {

  const [state, handleSubmit] = useState('');
  const submittedStyle = state.succeeded ? { visibility: 'hidden' } : {};
  const submittedText = state.succeeded ? "Thank you! we will be in touch" : "Get started by creating your own coopoerative";

  return (
    <section className={styles.landing__cover}>
      <div className={styles.landing__content}>
        <h1> Our Aim? </h1>
        <h4>
          We aim to create a peer to peer financial lending protocol based on the age old tradition called <i>Ajo</i>',
          which presents a round robin style of claiming a pool of funds provided by peers.
        </h4>
        <h3>{submittedText}</h3>
        <form
          style={submittedStyle}
          onSubmit={handleSubmit}
          className={styles.input__group}
        >
          <button
            type="submit"
            disabled={state.submitting}
            className="--filled"
          >
            <p>Create Cooperative</p>
          </button>
        </form>
      </div>
      <div className="--smallshow">
        <img alt="nice cream" src={BgCream} />
      </div>
    </section>
  );
}
