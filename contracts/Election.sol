pragma solidity ^0.4.18;

contract Election {

    //model a candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }
    //fetch candidate
    mapping (uint => Candidate) public candidates;
    //store accouts that have voted
    mapping (address => bool) public voters;

    uint public candidatesCount;

    modifier voteOnce {
        require(voters[msg.sender] == false);
        _;
    }

    event LogVoteEvent (
        uint indexed _candidateId
    );

    function Election() public {
        addCandidate("Blockchain");
        addCandidate("Groot");
    }

    function addCandidate(string _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote(uint _candidateId) public voteOnce {
        require(_candidateId > 0 && _candidateId <= candidatesCount);
        voters[msg.sender] = true;
        candidates[_candidateId].voteCount++;
        LogVoteEvent(_candidateId);
    }

}