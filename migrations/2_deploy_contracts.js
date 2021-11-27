var SimpleStorage = artifacts.require("./CooperativeFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
};
