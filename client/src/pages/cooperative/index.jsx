import React, { useState, useEffect } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import Skeleton from "react-loading-skeleton";
import Loader from "react-loader-spinner";
import 'antd/dist/antd.css';
import Invite from "./invite";

import CooperativeContract from "../../contracts/Cooperative.json";
import { EyeClosed, EyeOpen } from "./assets";
import { Table, Tag } from 'antd';

import "./cooperative.scss";
import "react-loading-skeleton/dist/skeleton.css";

var randomColor = require('randomcolor'); // import the script

const dataSource = [
    {
      key: '1',
      info: 'claimed',
      role: "claimer",
      address: '0x02b24AC2239b344FbC4577801f7000901E7a3944',
    }
  ];
  
  const columns = [
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (tag) => {
        return (
            <Tag color={randomColor({seed: tag})} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
      }
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Information',
      dataIndex: 'info',
      key: 'info',
    },
  ];

const format = "DD-MM-YY";
const zeroAddress = 0x0000000000000000000000000000000000000000;
export default function Index() {
	const navigate = useNavigate();
	const { address } = useParams();
	const [modalOpen, setModalOpen] = useState(false);
	const [blocked, setBlocked] = useState("");
	const [loading, setLoading] = useState(true);
	const [txLoading, setTxLoading] = useState(false);
	const [privacy, setPrivacy] = useState(false);
	const [contract, setContract] = useState(null);
	const [roundRole, setRoundRole] = useState("");
	const [amount, setAmount] = useState(0);
	const [balance, setBalance] = useState(0);
	const [maxUsers, setMaxUsers] = useState(0);

	const [userRatio, setUserRatio] = useState("");
	const [status, setStatus] = useState("");
	const [dueDate, setDueDate] = useState("");
    const [round, setRound] = useState(0);
    const [tableData, setTableData] = useState([]);

	const { library, account, active } = useWeb3React();

	// fetch and save the contract
	useEffect(() => {
		if (!library || !library) return;
		setLoading(true);
		try {
			const cooperativeContract = new ethers.Contract(
				address,
				CooperativeContract.abi,
				library.getSigner(account)
			);
			setContract(cooperativeContract);
		} catch (err) {
			toast.error(err.message);
			setTimeout(() => {
				setBlocked(true);
			}, 1000);
			setLoading(false);
		}
	}, [address, library, account]);

    async function fetchAllUsers(maxUser) {
        console.log(maxUsers);
        const userInfoPromises = [...Array(+maxUser).keys()].map(async (userIndex) => {
            const address = await contract.users(userIndex);
            const userInfo = await contract.userSettings(address);
            console.log({address, userInfo});
            // alert(address);
            return {
                key: userIndex,
                address,
                role: userInfo.roundRole == 1 ? "DEPOSITOR" : "CLAIMER",
                info: userInfo.roundRole == 1 ? (userInfo.paidForRound ? "DEPOSITED" : "NOT DEPOSITED") : (userInfo.claimed ? "CLAIMED" : "NOT CLAIMED")
            }
        });
        const userInfo = await Promise.all(userInfoPromises);
        setTableData(userInfo);
    }

	useEffect(() => {
		if (!contract) return;
		(async function () {
			// check if this account is a member
			const whoInvited = await contract.invitedBy(account);
			if (whoInvited == zeroAddress) {
				toast.error(
					"You are not a member of this cooperative, you will be redirected to the homepage"
				);
				return setBlocked(true);
			}
			const {
				roundRole: lrR,
				nextExpectedDepositDate,
			} = await contract.userSettings(account);
			const userCount = (await contract.userCount()).toString();
			const maxUser = (await contract.maxUsers()).toString();
			const contribAmount = (
				await contract.contributionAmount()
			).toString();
			const cooperativestatus = (await contract.status()).toString();
			const balance = (await contract.getBalance()).toString();
            const round = (await contract.currentRound()).toString();

            setRound(round);
			setStatus(
				cooperativestatus == 0
					? "initialised"
					: cooperativestatus == 1
					? "started"
					: "ended"
			);
			const userRatio = `${userCount} out of ${maxUser} joined`;
			setMaxUsers(maxUser);
			setBalance(balance);
			setAmount(contribAmount);
			setUserRatio(userRatio);
			setRoundRole(lrR.toString() == 0 ? "claimer" : "depositor");
			setDueDate(
				moment(new Date(+nextExpectedDepositDate.toString() * 1000)).format(format)
			);

            fetchAllUsers(maxUser);
			return;
		})()
			.then(() => {
            })
			.catch((err) => {
				toast.error(err.message);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [contract]);


	useEffect(() => {
		if (!blocked) return;
		navigate("/");
	}, [blocked]);

	const userAction = async () => {
		setTxLoading(true);
		if (roundRole == "depositor") {
			await contract
				.deposit({
					value: amount,
				})
				.then(async (tx) => {
					toast.info("Transaction submitting!");
					await tx.wait(1);
					toast.success("Funds have been deposited");
					// get the contract creates by this user,
				})
				.catch((err) => {
					// console.log({ err });
					toast.error(err.error.message);
				})
				.finally(() => {
					setLoading(false);
				});
		} else {
            await contract.claim()
            .then(async (tx) => {
                toast.info("Transaction submitting!");
                await tx.wait(1);
                toast.success("Funds have been Claimed");
                // get the contract creates by this user,
            })
            .catch((err) => {
                // console.log({ err });
                toast.error(err.error.message);
            })
            .finally(() => {
                setLoading(false);
            });
		}

		setTxLoading(false);
	};

	const inviteUser = () => {};

	return (
		<div className="single-cooperative">
			{/* the body */}
			<div className="single-cooperative__body">
				{!loading ? (
					<div className="left__balance">
						<div className="pretext">
							<span>Current Pool balance</span>
							<span
								onClick={() => setPrivacy(!privacy)}
								style={{ fontSize: "14px" }}
							>
								{privacy ? <EyeClosed /> : <EyeOpen />}
							</span>
						</div>
						<h2>
							{privacy
								? "****"
								: ethers.utils.formatEther(balance) + "Ethers"}
						</h2>
						<div className="posttext">
							{privacy
								? "****"
								: `out of ${
										ethers.utils.formatEther(amount) *
										(+maxUsers - 1)
								  } Ethers`}
						</div>
					</div>
				) : (
					<div style={{ width: "50%" }}>
						<Skeleton
							style={{ width: "20%" }}
							height={"20px"}
							count={1}
						/>
						<Skeleton
							style={{ width: "35%" }}
							height={"50px"}
							count={1}
						/>
						<Skeleton
							style={{ width: "25%" }}
							height={"25px"}
							count={1}
						/>
					</div>
				)}
				{!loading ? (
					<div className="right__actions">
						<div className="right__actions__info"></div>
						<div className="right__actions__actions">
                            {
                                status === "started" && (
                                    <span><i>Next due date: {dueDate}</i></span>
                                )
                            }
							<div className="buttons">
								{status === "started" ? (
									<button
										className="--filled"
										disabled={status === "ended"}
										onClick={userAction}
									>
										{txLoading ? (
											<Loader
												type="Puff"
												color="#fff"
												height={20}
												width={20}
											/>
										) : roundRole === "claimer" ? (
											"Claim Pool"
										) : (
											"Deposit Funds"
										)}
									</button>
								) : (
									<button
										onClick={() => setModalOpen(true)}
										className="--lined"
									>
										Invite Member
									</button>
								)}
							</div>
							<div className="information">
								{status == "initialised"
									? userRatio
									: status.toUpperCase()}
							</div>
						</div>
					</div>
				) : (
					<div style={{ width: "40%" }}>
						<Skeleton height={"25px"} count={4} />
					</div>
				)}
			</div>
			{/* the body */}
            {/* the footer */}
            <div className="single-cooperative__table">
                {
                    loading ? (
                        <Skeleton count={20} />
                    ) : (
                        <>
                        {
                            status == "initialised" ? (
                                <h3>Use the accounts you invited to invite other accounts(One account per invite), until we have reached the maximum number of users</h3>
                            ):(
                                <h3>Activity For round - {round}</h3>
                            )
                        }
                            <Table dataSource={tableData} columns={columns} />
                        </>
                    )
                }
            </div>
            {/* the footer */}
			{modalOpen && (
				<Invite
					onClose={() => {
						setModalOpen(false);
					}}
					contract={contract}
				/>
			)}
		</div>
	);
}
