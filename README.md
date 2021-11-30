## Project: A Savings Cooperative
**Author's ETH ADDRESS** : 0xC076FE76E995cC6FFF0F1e58fcA10Dbb8Fc5581F

**Description**: The project stems from a tradition common in africa where a certain number of people contribute money on a monthly basis and give the lump sum to a member of the group, this contribution goes on a monthly basis until every memner of the group has gotten a turn in recieving the lump sum.

**Walkthrough**: https://www.loom.com/share/4be9fea26f994190ba0f3ee66538f535?focus_title=1&muted=1&from_recorder=1

### Cooperative Contract Example Workflow

This Project involves the development of a cooperative society on the blockchain, in which several parties pool resources together several times, and each time th epooled funds are given to a random user(No user would be chosen twice), it ends when all users have gottena turn

  

1. Users will have to register themselves somehow on the contract

2. They have to identify which cooperative they are a a part of  create a new cooperative and join.

3. Users can only join a cooperative by invitation.

4. They'll be able to save money to the cooperative contract on a monthly basis.

5. A round robin style of recieving payments on a monthly basis.

6. After payments have been disbursed to every single member, then the cooperative ends.


## File Structure:
We use `truffle unbox react` in order to generate a generic file structure which follows the following pattern:

- Client -> this contains all the frontend code built in react.
- Contracts -> This contains all the smart contracts which were developed.
-  migrations -> This contains all the migrations for the smart contracts.
- test -> This contains the tests of the contracts
```
├── README.md
├── avoiding_common_attacks.md
├── contracts
│   ├── Cooperative.sol
│   └── CooperativeFactory.sol
├── design_pattern_decisions.md
├── finalprojectchecklist-211015-155241.txt
├── migrations
│   ├── 1_initial_migration.js
│   └── 2_deploy_contracts.js
├── package.json
├── test
│   └── cooperative.js
│   └── cooperativeFactory.js
├── truffle-config.js
└── yarn.lock
```

## How to run this project locally:

### [](https://github.com/diasgab/blockchain-developer-bootcamp-final-project#prerequisites)Prerequisites
The below must necesarily be installed on your system

-   Truffle v5.3.7 (core: 5.3.7)
-   Solidity - 0.8.6 (solc-js)
-   Node v12.16.1 (you can use  `nvm use v12.16.1`)
-   Web3.js v1.3.6
-   Ganache CLI v6.12.2
-  Metamask

### Running Frontend Locally
### Then we run the following commands:
The following commands are used for running the client:
- `git clone https://github.com/xand6r/blockchain-developer-bootcamp-final-project.git` 
- `cd client`
- `yarn install`
- `yarn start`

### Running Contracts tests Locally
The following commands are used to run the tests:

- `git clone https://github.com/xand6r/blockchain-developer-bootcamp-final-project.git` 
- Run the `yarn install` command to install all the package dependencies
- Run the `truffle compile` command to compile the smart contract source code files.
- In another terminal window, run the ganache-cli command to start a local blockchain for testing.
- Run the `truffle test` command to run all the unit tests.
- Set the correct port number for the development blockchain in the truffle-config.js file.
- Run the `truffle migrate` development command to deploy smart contract to local testnet.
