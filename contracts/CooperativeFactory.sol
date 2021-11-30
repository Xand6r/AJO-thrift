/// @author Shuaibu Alexander
/// @title A cooperative deployer contract, this contract helps us to deploy and keep track of several instances of the cooperative contract
// SPDX-License-Identifier: GPL-3.0
import "@openzeppelin/contracts/access/Ownable.sol";
pragma solidity ^0.8.3;
import "./Cooperative.sol";


contract CooperativeFactory is Ownable{

    address[] public createdCooperatives;
    mapping(address => address) public creatorToCooperative;

    /// @notice This function is used to deploy a cooperative contract which would hold all the details about the cooperative
    function createCooperative(
        uint _maxUsers,
        uint _contributionInEther,
        uint _frequencyInDays
    ) public returns(address){
        address newCooperative = address(new Cooperative(
            _maxUsers, _contributionInEther, _frequencyInDays
        ));
        createdCooperatives.push(newCooperative);
        creatorToCooperative[msg.sender] = newCooperative;
        return newCooperative;
    }
    /// @notice This method is used to get every single cooperative created in the contract
    /// @return createdCooperatives which is an array of addresses of deployed contributions
    function getAllContributions() public view returns(address[] memory){
        return createdCooperatives;
    }
}