import React, { useState } from "react";
import ConnectButton from "../../../../components/connect";
import { useWeb3React } from "@web3-react/core";

import styles from "./landing.module.scss";

export default function Index() {
	const [state, handleSubmit] = useState("");
	const { connector, activate, active, error, account } = useWeb3React();
	const submittedStyle = !active ? { visibility: "hidden" } : {};
	const submittedText = !active
		? "Please connect your wallet to proceed."
		: "Get started by creating your own cooperative";

	return (
		<section className={styles.landing__cover}>
			<div className={styles.landing__content}>
				<h1> Our Aim? </h1>
				<h4>
					We aim to create a peer to peer financial lending protocol
					based on the age old Nigerian tradition called{" "}
					<a href="https://www.pulse.ng/lifestyle/money/saving-scheme-ajo-benefits-of-contributory-thrift-saving-scheme/2sfb1ne">
						<i>Ajo</i>
					</a>
					, which presents a round robin style of claiming a pool of
					funds provided by peers.
				</h4>
				<h3>{submittedText}</h3>

				<form
					onSubmit={handleSubmit}
					className={styles.input__group}
          action="javascript:void(0)"
				>
          {
            !active ? (
              <div style={{ width: "33%", position: "relative" }}>
                <ConnectButton />
              </div>
            ) : (
            <button
              type="submit"
              disabled={state.submitting}
              className="--filled"
            >
              <p>Create Cooperative</p>
            </button>
            )
          }
				</form>
			</div>
			<div className="--smallshow">
				<div style={{ width: "100%", height: "5vh" }}></div>
			</div>
		</section>
	);
}
