App = {
  web3Provider: null,
  contracts: {},
  account: "0x0",

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if(typeof web3 != undefined){
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Election.json', function(election) {
      //Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      //connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);
    });
    return App.render();
  },

  render: function() {
    let electionInstance;
    let loader = $("#loader");
    let content = $("#content");

    loader.show();
    content.hide();

    //load account data
    web3.eth.getCoinbase(function(err, account) {
      if(err == null) {
        App.account = account;
        $("#accountAddress").html("Your account: " + account);
      }
    });

    //load contract data
    App.contracts.Election.deployed().then(function(i) {
      electionInstance = i;
      return electionInstance.candidatesCount();
    }).then(function(candidatesCount){
      let candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      for(let i = 1; i <= candidatesCount; i++) {
        electionInstance.candidates(i).then(function(candidate) {
          let id = candidate[0];
          let name = candidate[1];
          let voteCount = candidate[2];

          //render candidate results
          let candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>";
          candidatesResults.append(candidateTemplate);
        });
      }

      loader.hide();
      content.show();
    }).catch(function(error) {
        console.warn(error);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
