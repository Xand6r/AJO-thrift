import React from "react";
import { ethers } from "ethers";
import { useClickAway } from 'react-use';
import { toast } from "react-toastify";
import Loader from "react-loader-spinner";
import { useWeb3React } from "@web3-react/core";
import FactoryContract from "../../../../contracts/CooperativeFactory.json";
import "./create.scss";

const INITIAL_STATE = {
	numberOfUsers: 3,
	contributionAmount: 0.1,
	duration: 7,
};
const networkDeployed = 4; //for the rinkeyby network;

export default function Index({onClose}) {
    const modalRef = React.useRef(null);
	const [loading, setLoading] = React.useState(false);
	const { library, active, error } = useWeb3React();
	const [state, setState] = React.useState(INITIAL_STATE);
	const changeState = (e) => {
		const { name, value } = e.target;
		setState({
			...state,
			[name]: value,
		});
	};

    useClickAway(modalRef, () => {
        if(loading){
            toast.error("Transaction Loading, Please Hodl on");
        }else{
            onClose();
        }
    });

	const onSubmit = () => {
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
		try {
			setLoading(true);
			// actual submit
			const coreContractInstance = new ethers.Contract(
				FactoryContract.networks[networkDeployed].address,
				FactoryContract.abi,
				library
			);
			// call method to create cooperation
			console.log(coreContractInstance);
		} catch (err) {
			toast.error(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div ref={modalRef} className="create-modal-overlay">
			<div className="create-modal">
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
                        <span style={{marginRight:"10px"}}>Hodl tight!</span>
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
