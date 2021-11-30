const CooperativeFactory = artifacts.require("CooperativeFactory.sol");
const Cooperative = artifacts.require("Cooperative.sol");

/**
 * This essentially tests for if the deployer works fine as planned and the variables instantiated are the ones existing on the contract
 */

contract("CooperativeFactory", accounts => {
  it("It should deploy a cooperative contract correctly!", async () => {
    const cooperativeFactory = await CooperativeFactory.deployed();
    const maxUsers = 3;
    const contributionInEther = '10000000000000000000';
    const frequencyInDays = 30;

    // Cooperative Factory
    await cooperativeFactory.createCooperative(
      maxUsers, contributionInEther, frequencyInDays,
      { from: accounts[0] }
    );

    // Get stored cooperative address from first array element
    const registeredAccount = await cooperativeFactory.getAllContributions.call();
    // Get address stored in mapping
    const mappingAccount = await cooperativeFactory.creatorToCooperative.call(accounts[0]);

    // created cooperative
    const cooperative = await Cooperative.at(`${registeredAccount[0]}`);
    const coMaxUsers = await cooperative.maxUsers.call();
    const coFrequencyInDays = await cooperative.frequencyInDays.call();
    const coContributionInEther = await cooperative.contributionAmount.call();

    // make sure the variables we passed into the contract are actually what is there
    assert.equal(registeredAccount[0], mappingAccount, "Address on mapping and array do not match.");
    assert.equal(coMaxUsers, maxUsers.toString(), "Users on contract and the one passed into the factory differ");
    assert.equal(coFrequencyInDays.toString(), frequencyInDays, "CoFrequencyInDays on contract and the one passed into the factory differ");
    assert.equal(coContributionInEther.toString(), contributionInEther, "contributionInEther on contract and the one passed into the factory differ");
  });
});
