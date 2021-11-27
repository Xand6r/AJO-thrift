const Cooperative = artifacts.require("Cooperative.sol");

const maxUsers = 3;
const contributionInEther = '10000000000000000000';
const frequencyInDays = 30;

contract("Cooperative",function(accounts){
    beforeEach(async () => {

        cooperative = await Cooperative.new(
            maxUsers, contributionInEther, frequencyInDays,
            { from: accounts[0] }
        );
    });

    it("It should deploy a cooperative contract correctly!", async () => {
        
        const coMaxUsers = await cooperative.maxUsers.call();
        const coFrequencyInDays = await cooperative.frequencyInDays.call();
        const coContributionInEther = await cooperative.contributionAmount.call();
    
        // make sure the variables we passed into the contract are actually what is there
        assert.equal(coMaxUsers, maxUsers.toString(), "Users on contract and the one passed into the factory differ");
        assert.equal(coFrequencyInDays.toString(), frequencyInDays, "CoFrequencyInDays on contract and the one passed into the factory differ");
        assert.equal(coContributionInEther.toString(), contributionInEther, "contributionInEther on contract and the one passed into the factory differ");
    });

    it("owner variable should be the account which deployed it", async() => {

        const contractOwner = await cooperative.owner.call();

        assert.equal(contractOwner, accounts[0], "The owner variable is not the account which created the contract");
    });
});