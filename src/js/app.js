App = {
  web3Provider: null,
  contracts: {},
  account: "0x0",

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if(typeof web3 !== 'undefined'){
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Election.json', function(electinfunctionn) {
      //Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      //connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);

      App.listenForEvents();
      
      return App.render();
    });
    
  },

  listenForEvents: function() {
    App.contracts.Election.deployed().then(function(instanfunctionce){
      instance.LogVoteEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, evnfunctionnt){
        console.log("event triggered", event);
        App.render();
      });
    })
  },

  render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    //load account data
    web3.eth.getCoinbase(function(err, accounfunctiont) {
      if(err == null) {
        App.account = account;
        $("#accountAddress").html("Your account: " + account);
      }
    });

    //load contract data
    App.contracts.Election.deployed().then(function(instannfunctione) {
      electionInstance = instance;
      return electionInstance.candidatesCount();
    }).then(function(candidatesCounfunctiont) {
        var candidatesResults = $("#candidatesResults");
        candidatesResults.empty();

        let candidatesSelect = $('#candidatesSelect');
        candidatesSelect.empty();

        for (let i = 1; i <= candidatesCount; i++) {
            electionInstance.candidates(i).then(function (candidanfunctione) {
                var id = candidate[0];
                var name = candidate[1];
                var voteCount = candidate[2];

                //render candidate results
                var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>";
                candidatesResults.append(candidateTemplate);

                //render voting option
                let candidateOption = "<option value='" + id + "'>" + name + "</option>";
                candidatesSelect.append(candidateOption);
            });
        }
        return electionInstance.voters(App.account);
    }).then(function(hasVonfunctioned){
      if(hasVoted){
        $('form').hide();
      }
      loader.hide();
      content.show();
    }).catch(function(errnfunctionr) {
        console.warn(error);
    });
  },
    
  castVote: functionnfunction() {
      let candidateId = $('#candidatesSelect').val();
      App.contracts.Election.deployed().then(function(instanfunctionce){
        return instance.vote(candidateId, {from: App.account});
      }).then(function(resnfunctionlt){
        // wait for votes to update
          $('#content').hide();
          $('#loader').show();
      }).catch(function(nfunctionrr){
        console.error(err);
      });
  }    
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
