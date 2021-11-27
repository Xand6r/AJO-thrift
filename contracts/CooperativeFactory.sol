/// @author Shuaibu Alexander
/// @title A cooperative deployer contract, this contract helps us to deploy and keep track of several instances of the cooperative contract
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.3;
import "./Cooperative.sol";
// import "hardhat/console.sol";

contract CooperativeFactory{

    address[] public createdCooperatives;
    mapping(address => address) public creatorToCooperative;

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

    function getAllContributions() public view returns(address[] memory){
        return createdCooperatives;
    }
}