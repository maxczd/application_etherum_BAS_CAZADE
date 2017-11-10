// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
import ipfsAPI from 'ipfs-api'

// Import our contract artifacts and turn them into usable abstractions.
import metacoin_artifacts from '../../build/contracts/MetaCoin.json' //tous les paramètre de la fonction MetaCoin

// MetaCoin is our usable abstraction, which we'll use through the code below.
var MetaCoin = contract(metacoin_artifacts); //adaptateur
window.MetaCoin = MetaCoin;
var ipfs = ipfsAPI();
window.ipfs = ipfs;

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];

      var address_user = document.getElementById("address_user");
      address_user.innerHTML = account.valueOf();


      $.getJSON('app/music.json', function(data) {
        var musicRow = $('#musicRow');
        var musicTemplate = $('#musicTemplate');

        for (var i = 0; i < data.length; i ++) {
          var clas = i.toString(); 
          musicTemplate.find('img').attr('src', data[i].picture);
          musicTemplate.find('.music-title').text(data[i].title);
          musicTemplate.find('.music-artist').text(data[i].artist);
          musicTemplate.find('.music-date').text(data[i].date);
          musicTemplate.find('.music-download').text(data[i].dowlnoad);
          musicTemplate.find('.music-etherum').text(data[i].etherum);
          musicTemplate.find('.btn-adopt').attr('data-id', data[i].id).removeClass().addClass('btn btn-download btn-adopt').addClass(clas);

          musicRow.append(musicTemplate.html());
        }
      });

      self.refreshBalance();
    });
  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  refreshBalance: function() {
    var self = this;

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(account, {from: account});
    }).then(function(value) {
      var balance_element = document.getElementById("balance");
      balance_element.innerHTML = value.valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting balance; see log.");
    });
  },

  upload: function() {
    var amount = parseInt(document.getElementById("price").value);
    var nombre_artiste = parseInt(document.getElementById("contributors").value);

    console.log(amount);
    console.log(nombre_artiste);


  },

  sendCoin: function(e) {
    var self = this;
    console.log(self);

    var button_all_class = e.getAttribute('class');
    var button_class = button_all_class.substr(27);
    console.log(button_class);

    //accès json et comparer valeurs
     
      
     var amount=0;

    var nombre_artiste = 0;

    var result = {amount: amount, nombre_artiste: nombre_artiste};
    
    this.setStatus("Initiating transaction... (please wait)");
    //console.log(receiver);
    var meta;
    MetaCoin.deployed().then(function(instance) {
      console.log(instance);
      meta = instance;

      $.getJSON('app/music.json', function(data) {
        var musicTemplate = $('#musicTemplate');

        for (var i = 0; i < data.length; i ++) {
          if(button_class == parseInt(i))
          {
            amount = data[i].etherum;
            nombre_artiste = data[i].contributors;
            console.log("prix=" +amount);
            console.log("contrib=" +nombre_artiste);
          }          
        } 
        var result = {amount: amount, nombre_artiste: nombre_artiste};
        //alert (JSON.stringify(result.amount),2,2);
        return result;             
     });
     
      setTimeout(function () { 
        alert(nombre_artiste);
         var receiver = new Array(nombre_artiste);
  
    for(var i=0;i<nombre_artiste;i++){
        receiver[i] = accounts[i+1];
      }
         meta.sendCoin(receiver, amount, {from: account});
         window.location.reload();
        }, 3000);
      }).then(function() {
        self.setStatus("Transaction complete!");
        self.refreshBalance();
      }).catch(function(e) {
        console.log(e);
        self.setStatus("Error sending coin; see log.");
      });

    //});
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();

});
