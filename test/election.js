var Election = artifacts.require("./Election.sol");

contract("Election", function(accounts){
    var electionInstance;

    it("Initialized with two candidates", function(){
        return Election.deployed().then(function(instance){
            return instance.candidatesCount();
        }).then(function(count){
            assert.equal(count, 2);
        });
    });

    it("Contract initializes with the correct values", function(){
        return Election.deployed().then(function(instance){
            electionInstance = instance;
            return electionInstance.candidates(1);
        }).then(function(candidate){
            assert.equal(candidate[0], 1, "contains the correct ID");
            assert.equal(candidate[1], "Blockchain", "contains the correct name");
            assert.equal(candidate[2], 0, "contains the correct voteCount");
            return electionInstance.candidates(2);
        }).then(function(candidate){
            assert.equal(candidate[0], 2, "contains the correct ID");
            assert.equal(candidate[1], "Groot", "containts the correct name");
            assert.equal(candidate[2], 0, "contains the correct voteCount");
        });
    });

    it("vote received", function(){
        return Election.deployed().then(function(instance){
            electionInstance = instance;
            candidateId = 1;
            return electionInstance.vote(candidateId, {from: accounts[0]});
        }).then(function (receipt) {
            return electionInstance.voters(accounts[0]);
        }).then(function (voted) {
            assert(voted, "the voter was marked as voted");
            return electionInstance.candidates(candidateId);
        }).then(function (candidate) {
            let voteCount = candidate[2];
            assert.equal(voteCount, 1, "candidate received vote");
        })
    });

});
