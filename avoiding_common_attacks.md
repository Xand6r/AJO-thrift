## Contract security measures

- **SWC-101 (Integer overflow)** : This was avoided by the use of a version of solidity which incorporated the sue of safe maths library.
- **SWC-100** : This was avoided by explicitly defining the visibility status of several functions as needed.
- **Use Modifiers Only for Validation**: I ensured this was followed by only using modifiers for securing certain conditions from being called under undesirec onditions.
- **Proper Use of Require, Assert and Revert**: These were used to protect the functions of the contract from being called under un favourable conditions.
- **Forcibly Sending Ether**: Excess Ether sent to the deposit function would be returned