import React from "react";
import { ethers } from "ethers";
import { useClickAway } from 'react-use';
import { toast } from "react-toastify";
import Loader from "react-loader-spinner";
import { useWeb3React } from "@web3-react/core";
import "./create.scss";

const INITIAL_STATE = {
	address: ""
};
const networkDeployed = 4; //for the rinkeyby network;

export default function Index({onClose, contract}) {
    const modalRef = React.useRef(null);
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
        if(loading){
            toast.error("Transaction Loading, Please Hodl on");
        }else{
            onClose();
        }
    });

	const onSubmit = async () => {
		if (
			!state.address
		) {
			return toast.error("Please fill in the address", {
				position: "top-left",
			});
		}
        setLoading(true);
        // actual submit

        // call method to create cooperation
        await contract.inviteUser(state.address).then(async (tx) => {
            toast.info("Transaction submitting!");
            await tx.wait(1);
            toast.success("User has been sucesfully invited");
            // get the contract creates by this user,
            onClose();
        }).catch((err) => {
			console.log({err});
            toast.error(err.error.message);
        }).finally(() => {
            setLoading(false);
        });
	};

	return (
		<div className="invite-modal-overlay">
			<div  ref={modalRef} className="invite-modal">
				<h3 className="invite-modal-title">Invite User</h3>
				<div className="invite-modal-inner">
					<div className="modal-input-group">
						<label htmlFor="">Address of user</label>
						<input
							onChange={changeState}
							value={state.address}
							type="text"
							name="address"
							placeholder="address of users"
							min={3}
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
