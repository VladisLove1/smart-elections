pragma solidity ^0.4.2;

contract Election {

    //model a candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }
    //fetch candidate
    mapping (uint => Candidate) public candidates;
    uint public candidatesCount;

    function Election() public {
        candidate = 'Blockchain';
    }

    function addCandidate(string _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

}