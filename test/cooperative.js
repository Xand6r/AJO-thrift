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

    it("owner variable should be the account which deployed it", async () => {
        const contractOwner = await cooperative.owner.call();
        assert.equal(contractOwner, accounts[0], "The owner variable is not the account which created the contract");
    });

    it("Cooperative status should be marked as initialised", async () => {
        const electionStatus = await cooperative.status.call();
        assert.equal(electionStatus, 0, "Cooperative is not marked as initialised");
    });

    it("Can invite a user to the cooperative", async () => {
        await cooperative.inviteUser(accounts[1]);
        const whoInvitedNewMember = await cooperative.invitedBy.call(accounts[1]);

        assert.equal(whoInvitedNewMember, accounts[0], "Cannot invite a new user to the cooperative");
    });

    it("Can deposit to contribution pool", async () => {
        await cooperative.canClaimPool.call();
        for(let i = 0;i<maxUsers - 1;i++){
            await cooperative.inviteUser(accounts[i+1],{ from: accounts[i] });
            // cooperative = await Cooperative.inviteUser({ from: accounts[0] });
        }
        await cooperative.deposit({ from: accounts[maxUsers-1], value: "10000000000000000000" });
    });

    it("Can claim contribution pool when in turn", async () => {
        await cooperative.canClaimPool.call();
        // invite eveyone to the election so it can be marked as started
        for(let i = 0;i<maxUsers - 1;i++){
            await cooperative.inviteUser(accounts[i+1],{ from: accounts[i] });
            // cooperative = await Cooperative.inviteUser({ from: accounts[0] });
        }
        const claimer = await cooperative.users.call(0); //after initialisation, the claimer would always be the first user
        // make everyone apart from the claimer contribute
        for(let i=0;i<maxUsers;i++){
            if(accounts[i] == claimer) continue;
            await cooperative.deposit({ from: accounts[i], value: "10000000000000000000" });
        }
        // make the claimer
        await cooperative.claim({from: claimer});

        assert.equal(claimer, accounts[0])
    });
});