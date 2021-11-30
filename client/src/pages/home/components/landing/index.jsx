import React, { useState } from "react";
import { ethers } from "ethers";
import { toast } from 'react-toastify';
import { useWeb3React } from "@web3-react/core";

import FactoryContract from "../../../../contracts/CooperativeFactory.json";
import ConnectButton from "../../../../components/connect";
import CreateModal from "../create";
import styles from "./landing.module.scss";

const networkDeployed = 4; //for the rinkeyby network;

export default function Index() {
	const [loading, setLoading] = React.useState(false);

	const { library, active, error } = useWeb3React();
	const [showModal, setShowModal] = useState(false)

	React.useEffect(() => {
		if(!error) return;
		toast.error(error.message, {
            position: "top-left",
        });
	},[error]);

	const submittedText = !active
		? "Please connect your wallet to proceed."
		: "Get started by creating your own cooperative";

	const onCreateCooperative = () => {
		// instantiate contract
		const coreContractInstance = new ethers.Contract(
			FactoryContract.networks[networkDeployed].address,
			FactoryContract.abi,
			library
		);
		// call method to create cooperation
		console.log(coreContractInstance);
	};

	const toggleModal = () => {
		setShowModal()
	};

	return (
		<>
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
						className={styles.input__group}
						action="javascript:void(0)"
					>
						{!active ? (
							<div style={{ width: "33%", position: "relative" }}>
								<ConnectButton />
							</div>
						) : (
							<button
								type="submit"
								disabled={loading}
								className="--filled"
								onClick={() => {
									setShowModal(true);
								}}
							>
								<p style={{marginBottom: 0}}>Create Cooperative</p>
							</button>
						)}
					</form>
				</div>
				<div className="--smallshow">
					<div style={{ width: "100%", height: "5vh" }}></div>
				</div>
			</section>
			{
				showModal && (
					<CreateModal onClose={() => {
						setShowModal(false)
					}} />
				)
			}
		</>
	);
}
