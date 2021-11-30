// define the solidity version
// SPDX-License-Identifier: GPL-3.0
/// @author Shuaibu Alexander
/// @title A cooperative Contract
pragma solidity ^0.8.3;
// import "hardhat/console.sol";

contract Cooperative {
    // ----- define the different enums which we are going to be using
    enum TransactionType {
        CLAIM,
        DEPOSIT
    }

    enum Status {
        INITIALISED,
        STARTED,
        CLOSED
    }
    enum Role {
        CLAIMER,
        DEPOSITOR
    }
    // define the different enums which we are going to be using

    // ----- define the events
    event LogTransaction(
        address indexed user,
        TransactionType indexed actionType,
        uint256 timeStamp
    );
    event UserAdded(
        address indexed user,
        address indexed addedBy,
        uint256 timestamp
    );
    // ----- define the events

    // define a structure for the user
    struct User {
        uint256 nextExpectedDepositDate; //The next date at which this user can deposit money
        bool paidForRound; //have they paid for this round of the contribution
        uint256 claimDueDate; //the date at which they can claim the loot
        bool claimed; //a boolean to indicate if they have actually claimed their loot
        Role roundRole; // an indicator of if they were a depositor or claimer during this
    }
    // define a structure for the user

    // predefine the contract's key variables
    Status public status;
    // initialise core variables for the contract
    uint256 public userCount; //initialise to one to account for the user who created the contract
    address[] public users; //store an array of all the users currently
    address public owner;
    uint256 public maxUsers;
    uint256 public contributionAmount;
    uint256 internal createdAt;
    uint256 public frequencyInDays;
    uint256 public currentRound;
    uint256 public startDate;
    // predefine the contract's key variables

    // define constants
    address private constant zeroAddress =
        0x0000000000000000000000000000000000000000;
    // define constants

    // creating a collection of mappings which would be used across the application
    mapping(address => User) public userSettings; //a mapping of user addresses to their payment info
    mapping(address => address) public invitedBy; // a mapping of the address of who was invited and who was not, on order to track invitations
    mapping(address => address) public invited; // a mapping of invitee => invitor

    // creating a collection of mappings which would be used across the application

    // write fallback functions, should in case a user wants to pay soome eth to this contract
    fallback() external payable {}

    receive() external payable {}

    // write fallback functions, should in case a user wants to pay soome eth to this contract

    // define the several modifiers which we would use across the contracts
    modifier isMember() {
        require(
            invitedBy[msg.sender] != zeroAddress,
            "This user is not a member of this cooperative"
        );
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier notEnoughMembers() {
        require(userCount < maxUsers, "This cooperative is already full");
        _;
    }

    modifier hasNotStarted() {
        require(
            status == Status.INITIALISED || status == Status.CLOSED,
            "This cooperative already started, This action is not allowed any more."
        );
        _;
    }

    modifier hasStarted() {
        require(
            status == Status.STARTED,
            "This cooperative has not yet been started, add more members"
        );
        _;
    }

    // if they happen to pay more than the required amount, then refund them
    modifier makeRefund() {
        //refund them after pay for item (why it is before, _ checks for logic before func)
        _;
        uint256 amountToRefund = msg.value - contributionAmount;
        if (amountToRefund > 0) {
            payable(msg.sender).transfer(amountToRefund);
        }
    }

    // check to make sure tha
    modifier checkAmount() {
        User memory oneUser = userSettings[msg.sender];
        require(
            oneUser.roundRole == Role.DEPOSITOR,
            "It is not your turn to deposit yet, please wait a turn"
        );
        require(
            msg.value >= contributionAmount,
            "Please make sure you are sending the minimum balance"
        );
        require(
            userSettings[msg.sender].paidForRound == false,
            "You Cannot make any more payments for this round."
        );
        _;
    }

    modifier canClaim() {
        //make sure their due date is passed and they have not claimed it
        User memory oneUser = userSettings[msg.sender];
        require(
            oneUser.roundRole == Role.CLAIMER,
            "It is not yo;ur turn to claim yet, please wait a while"
        );
        require(oneUser.claimed == false, "You have already claimed your pool");
        // maybe make sure that they can only claim at the end of the tenor
        // require(
        //     block.timestamp > oneUser.claimDueDate,
        //     "You are not due for a payment yet"
        // );
        require(
            address(this).balance >= (maxUsers - 1) * contributionAmount,
            "Please Hold on till more deposits are made"
        );
        _;
    }

    // define the several modifiers which we would use across the contracts

    /**
     * @dev a function used to assign due dates for others
     * @param numberOfUnits the number of days in which  we want to move foward by (in uints of the frequency of payment of the cooperative)
     **/
    function _unitTimeFromNow(uint256 numberOfUnits)
        private
        view
        returns (uint256)
    {
        return block.timestamp + (numberOfUnits * frequencyInDays * 1 days);
    }

    /**
     * @dev a function used to offset dates from the creation date by a facrot of the frequency of payments of the contracts
     **/
    function _offsetCreationDate(uint256 numberOfUnits)
        private
        view
        returns (uint256)
    {
        return createdAt + (numberOfUnits * frequencyInDays * 1 days);
    }

    /**
     * @dev Set contract deployer as owner
     */
    constructor(uint256 _users, uint256 _contributionInEther,uint256 _frequencyInDays) {
        require(_users >= 3, "The maximum number of users allowed is 3");
        require(
            _frequencyInDays >= 7,
            "The minimum frequency allowed is 7 days"
        );
        require(
            _contributionInEther > 0,
            "You cannot set zero as the minimum contribution"
        );
        // initialise variables from constructor
        maxUsers = _users; //this would be a oarameter to the constructor eventually
        frequencyInDays = _frequencyInDays; //this means the frequency at which contributions are to be made
        contributionAmount = _contributionInEther ; //this would be a parameter to the constructor eventually from the factory contract
        // initialise variables from constructor

        //initialise state variables
        userCount = 1; //the number of users existing in this contribution
        currentRound = 1; //which round are we on
        owner = tx.origin; //remove after we use the ownable contract
        users.push(tx.origin); //add this user to the array of users we have
        createdAt = block.timestamp; //initialise the creation date of the contract
        status = Status.INITIALISED; //initialise the contract
        invitedBy[tx.origin] = address(this); //make the sender invited by the contract
        //initialise state variables
    }

    /*
     * Functions of the contract
     */
    // function to return the balance of the contract
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    /// @notice Initialise all the registered users of a cooperative
    /// @dev we use this to initialise the state of the users in the contract.
    function initialiseUsers() internal hasNotStarted onlyOwner {
        for (uint256 i = 0; i < userCount; i++) {
            address oneUser = users[i];
            User memory newUser = User({
                roundRole: i == 0 ? Role.CLAIMER : Role.DEPOSITOR, //if it is the first user then make them a a claimer, otherwise make them a depositor
                claimDueDate: _unitTimeFromNow(i + 1),
                paidForRound: false,
                claimed: false,
                nextExpectedDepositDate: i == 0
                    ? _offsetCreationDate(currentRound + 1)
                    : _offsetCreationDate(currentRound) //the next date at which this user is meant to deposit
            });
            userSettings[oneUser] = newUser;
            // console.log(newUser.claimDueDate);
        }
        status = Status.STARTED;
    }

    /// @notice Invite a new user to the cooperative pool
    /// @dev it runs several checks to ensure unauthorised parties cannot join the cooperative society - Tested
    /// @param newUser The address of the user which we wish to invite to the cooperation
    /// @return address The addresss of the newly added user
    function inviteUser(address newUser)
        public
        hasNotStarted
        returns (address)
    {
        // run several checks to confirm the user can actually join the cooperative
        require(newUser != msg.sender, "You cannot invite yourself!");
        require(
            invitedBy[msg.sender] != zeroAddress,
            "You are not a member of this cooperation, please require an invite from a member"
        );
        require(
            invited[msg.sender] == zeroAddress,
            "You have invited another user already"
        );
        require(
            invitedBy[newUser] == zeroAddress,
            "This user has already been invited by another user to the cooperative"
        );

        invitedBy[newUser] = msg.sender;
        invited[msg.sender] = newUser;

        users.push(newUser);
        userCount = userCount + 1;
        if (userCount == maxUsers) {
            startDate = block.timestamp;
            initialiseUsers(); //initialise key variables of the user
        }

        emit UserAdded(newUser, msg.sender, block.timestamp);
        return newUser;
    }

    ///
    /// @notice Allows a user to claim the pooled funds for him
    ///
    function claim() public isMember hasStarted canClaim {
        // if all conditions pass, then send the user the right ether
        uint256 rightAmount = (maxUsers - 1) * contributionAmount;
        payable(msg.sender).transfer(rightAmount);
        // make it known that this user has claimed their stake
        User storage currentUser = userSettings[msg.sender];
        currentUser.claimed = true;
        currentRound += 1;
        // after claiming, reset everyone to a state of non payment and initialise next payment date
        for (uint256 i = 0; i < userCount; i++) {
            address oneUserAddress = users[i];
            User storage oneUser = userSettings[oneUserAddress];
            // if the current user, is the one to be paid in this cycle, then shift his next due date and roles accordingly
            if (currentRound == i + 1) {
                oneUser.nextExpectedDepositDate = _offsetCreationDate(
                    currentRound + 1
                );
                oneUser.paidForRound = true;
                oneUser.roundRole = Role.CLAIMER;
            } else {
                oneUser.nextExpectedDepositDate = _offsetCreationDate(
                    currentRound
                );
                oneUser.paidForRound = false;
                oneUser.roundRole = Role.DEPOSITOR;
            }
        }
        // after the last person has claimed, then we close down the cooperative
        if (currentRound - 1 == userCount) {
            status = Status.CLOSED;
        }
        emit LogTransaction(msg.sender, TransactionType.CLAIM, block.timestamp);
    }

    ///
    /// @notice function to help deposit, refund them if they pay more than the right amount
    ///
    function deposit()
        public
        payable
        isMember
        hasStarted
        checkAmount
        makeRefund
    {
        require(
            userSettings[msg.sender].paidForRound != true,
            "You have made a contribution for this round already, please wait till the next round"
        );
        User storage oneUser = userSettings[msg.sender];
        oneUser.paidForRound = true;
        emit LogTransaction(
            msg.sender,
            TransactionType.DEPOSIT,
            block.timestamp
        );
    }

    ///
    /// @notice return a boolen which indicates if the sending user can claim their pool
    ///
    function canClaimPool() public view isMember returns (bool) {
        User memory oneUser = userSettings[msg.sender];
        return
            oneUser.claimed == false &&
            oneUser.roundRole == Role.CLAIMER &&
            //&& block.timestamp > oneUser.claimDueDate
            address(this).balance >= (maxUsers - 1) * contributionAmount;
    }
}
