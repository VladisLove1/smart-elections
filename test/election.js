var Election = artifacts.require("./Election.sol");

contract("Election", function(accounts){
    var electionInstance;

    it("Initialized with the correct amount of candidates", function(){
        return Election.deployed().then(function(instance){
            return instance.candidatesCount();
        }).then(function(count){
            assert.equal(count, 5);
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
            assert.equal(receipt.logs.length, 1, "an event was triggered");
            assert.equal(receipt.logs[0].event, "LogVoteEvent", "the triggered event is the right one");
            assert.equal(receipt.logs[0].args._candidateId.toNumber(), candidateId, "everything is just fine, candidate ID is also correct");
            return electionInstance.voters(accounts[0]);
        }).then(function (voted) {
            assert(voted, "the voter was marked as voted");
            return electionInstance.candidates(candidateId);
        }).then(function (candidate) {
            var voteCount = candidate[2];
            assert.equal(voteCount, 1, "candidate received vote");
        });
    });

    it("throws an exception for invalid candidates", function(){
        return Election.deployed().then(function(instance){
            electionInstance = instance;
            return electionInstance.vote(99, {from: accounts[1]});
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
            return electionInstance.candidates(1);
        }).then(function(candidate1){
            var voteCount = candidate1[2];
            assert.equal(voteCount, 1, "first candidate didn't receive more than 1 vote");
            return electionInstance.candidates(2);
        }).then(function(candidate2){
            var voteCount = candidate2[2];
            assert.equal(voteCount, 0, "second candidate didn't receive any votes");
        });
    });

    it("throws an  exception for double voting", function() {
        return Election.deployed().then(function(instance){
            electionInstance = instance;
            candidateId = 2;
            electionInstance.vote(candidateId, {from: accounts[1]});
            return electionInstance.candidates(candidateId);
        }).then(function(candidate){
            var voteCount = candidate[2];
            assert.equal(voteCount, 1, "accepts first vote");
            return electionInstance.vote(candidateId, {from: accounts[1]});
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
            return electionInstance.candidates(1);
        }).then(function(candidate1){
            var voteCount = candidate1[2];
            assert.equal(voteCount, 1, "first candidate didn't receive any additional vote");
            return electionInstance.candidates(2);
        }).then(function(candidate2){
            var voteCount = candidate2[2];
            assert.equal(voteCount, 1, "second candidate didn't receive any additional vote");
        });
    });

});
