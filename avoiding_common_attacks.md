## Contract security measures

- **SWC-103 (Floating pragma)**
- **Use Modifiers Only for Validation**: I ensured this was followed by only using modifiers for securing certain conditions from being called under undesirec onditions.
- **Proper Use of Require, Assert and Revert**: These were used to protect the functions of the contract from being called under un favourable conditions.
- **Forcibly Sending Ether**: Excess Ether sent to the deposit function would be returned