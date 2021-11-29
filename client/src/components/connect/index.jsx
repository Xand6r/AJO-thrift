import React from "react";
import { useEagerConnect, useInactiveListener } from "../../hooks";
import { useWeb3React } from "@web3-react/core";

import "./connect.scss";
import MetaMask from "../../assets/metamask.svg";
import { injected } from "../../connectors";

export default function Index() {
	const { connector, activate, active, error, account } = useWeb3React();

	const walletButtomClass = true ? "--active" : "";

	// handle logic to recognize the connector currently being activated
	const [activatingConnector, setActivatingConnector] = React.useState();
	React.useEffect(() => {
		if (activatingConnector && activatingConnector === connector) {
			setActivatingConnector(undefined);
		}
	}, [activatingConnector, connector]);
	// handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
	const triedEager = useEagerConnect();

	// handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
	useInactiveListener(!triedEager || !!activatingConnector);

	const connectWalletPressed = () => {
		setActivatingConnector(injected);
		activate(injected);
	};

	return (
		<div className="metamask__window">
			<button
				id="walletButton"
                disabled={active}
				className={walletButtomClass}
				onClick={connectWalletPressed}
			>
				<img src={MetaMask} />
				{active && account.length > 0 ? (
					account.slice(0,4) + "......" + account.slice(38)
				) : (
					<span>Connect Wallet</span>
				)}
			</button>
		</div>
	);
}
