# Design Patterns

- **Inter-Contract Execution**: Using a deployer pattern ensured that i had to write two contracts and have one call the other. This pattern fufilled the above condition.
- **Inheritance and Interfaces**: Inheriting from ownable.sol in order to enable basic access control in the contract for functions that should be only callable by the owner