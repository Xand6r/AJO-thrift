import React from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { useClickAway } from "react-use";
import { toast } from "react-toastify";
import Loader from "react-loader-spinner";
import { useWeb3React } from "@web3-react/core";
import FactoryContract from "../../../../contracts/CooperativeFactory.json";
import "./create.scss";

function copy(text) {
	var textArea = document.createElement("textarea");

	//
	// *** This styling is an extra step which is likely not required. ***
	//
	// Why is it here? To ensure:
	// 1. the element is able to have focus and selection.
	// 2. if the element was to flash render it has minimal visual impact.
	// 3. less flakyness with selection and copying which **might** occur if
	//    the textarea element is not visible.
	//
	// The likelihood is the element won't even render, not even a
	// flash, so some of these are just precautions. However in
	// Internet Explorer the element is visible whilst the popup
	// box asking the user for permission for the web page to
	// copy to the clipboard.
	//

	// Place in the top-left corner of screen regardless of scroll position.
	textArea.style.position = "fixed";
	textArea.style.top = 0;
	textArea.style.left = 0;

	// Ensure it has a small width and height. Setting to 1px / 1em
	// doesn't work as this gives a negative w/h on some browsers.
	textArea.style.width = "2em";
	textArea.style.height = "2em";

	// We don't need padding, reducing the size if it does flash render.
	textArea.style.padding = 0;

	// Clean up any borders.
	textArea.style.border = "none";
	textArea.style.outline = "none";
	textArea.style.boxShadow = "none";

	// Avoid flash of the white box if rendered for any reason.
	textArea.style.background = "transparent";

	textArea.value = text;

	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();

	try {
		var successful = document.execCommand("copy");
		var msg = successful ? "successful" : "unsuccessful";
		console.log("Copying text command was " + msg);
	} catch (err) {
		console.log("Oops, unable to copy");
	}

	document.body.removeChild(textArea);
}

const INITIAL_STATE = {
	numberOfUsers: 3,
	contributionAmount: 0.1,
	duration: 7,
};
const networkDeployed = 4; //for the rinkeyby network;

export default function Index({ onClose }) {
	const modalRef = React.useRef(null);
	const navigate = useNavigate();
	const [loading, setLoading] = React.useState(false);
	const { library, error, account } = useWeb3React();
	const [state, setState] = React.useState(INITIAL_STATE);
	const changeState = (e) => {
		const { name, value } = e.target;
		setState({
			...state,
			[name]: value,
		});
	};

	useClickAway(modalRef, () => {
		if (loading) {
			toast.error("Transaction Loading, Please Hodl on");
		} else {
			onClose();
		}
	});

	const onSubmit = async () => {
		if (
			!state.numberOfUsers ||
			!state.contributionAmount ||
			!state.duration
		) {
			return toast.error("Please fill in all fields", {
				position: "top-left",
			});
		}
		if (
			state.numberOfUsers < 3 ||
			state.contributionAmount == 0 ||
			state.duration < 7
		) {
			return toast.error("Please make sure all filled values are valid", {
				position: "top-left",
			});
		}
		setLoading(true);
		// actual submit
		const deployerContractInstance = new ethers.Contract(
			FactoryContract.networks[networkDeployed].address,
			FactoryContract.abi,
			library.getSigner(account)
		);
		// call method to create cooperation
		await deployerContractInstance
			.createCooperative(
				state.numberOfUsers,
				"" + state.contributionAmount * (1 * 10 ** 18),
				state.duration
			)
			.then(async (tx) => {
				toast.info("Transaction submitting!");
				await tx.wait(1);
				toast.success("Cooperative sucesfully created");
				// get the contract creates by this user,
				const cooperativeAddress =
					await deployerContractInstance.creatorToCooperative(
						account
					);
				const link = `${window.location.host}/cooperative/${cooperativeAddress}`;
				copy(link);
				toast(
					"The link to your cooperative has been copied to clipboard, please ensure that you keep it safe as it cannot be recovered, you will be redirected shortly",
					{
						autoClose: 3000,
					}
				);
				setTimeout(() => {
					window.open(link, "_blank");
					onClose();
				}, 3000);
			})
			.catch((err) => {
				toast.error(err.message);
			})
			.finally(() => {
				setLoading(false);
			});
	};
	console.log({
		h: window.location.host,
	});

	return (
		<div className="create-modal-overlay">
			<div ref={modalRef} className="create-modal">
				<h3 className="create-modal-title">Create Cooperative</h3>
				<div className="create-modal-inner">
					<div className="modal-input-group">
						<label htmlFor="">Number of users(at least 3)</label>
						<input
							onChange={changeState}
							value={state.numberOfUsers}
							type="number"
							name="numberOfUsers"
							placeholder="Number of users wanted"
							min={3}
						/>
					</div>

					<div className="modal-input-group">
						<label htmlFor="">
							Contribution Amount <b>(in ether)</b>
						</label>
						<input
							type="number"
							onChange={changeState}
							value={state.contributionAmount}
							name="contributionAmount"
							placeholder="Amount to be contributed per person"
						/>
					</div>

					<div className="modal-input-group">
						<label htmlFor="">
							Cycle Duration <b>(in days, at least 7)</b>
						</label>
						<input
							type="number"
							onChange={changeState}
							value={state.duration}
							min={7}
							name="duration"
							placeholder="The number of days each cycle should last"
						/>
					</div>
				</div>

				<button
					className="--filled"
					onClick={onSubmit}
					disabled={loading}
				>
					{loading ? (
						<>
							<span style={{ marginRight: "10px" }}>
								Hodl tight!
							</span>
							<Loader
								type="Puff"
								color="#fff"
								height={20}
								width={20}
							/>
						</>
					) : (
						"Submit"
					)}
				</button>
			</div>
		</div>
	);
}
