// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
import ipfsAPI from 'ipfs-api'

// Import our contract artifacts and turn them into usable abstractions.
import royalether_artifacts from '../../build/contracts/Royalether.json' //tous les paramètre de la fonction Royalether

// Royalether is our usable abstraction, which we'll use through the code below.
var Royalether = contract(royalether_artifacts); //adaptateur
window.Royalether = Royalether;
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

    // Bootstrap the Royalether abstraction for Use.
    Royalether.setProvider(web3.currentProvider);

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


    /// Récupération des informations sur les oeuvres afin de les afficher ///

      $.getJSON('app/music.json', function(data) {
        var musicRow = $('#musicRow');
        var musicTemplate = $('#musicTemplate');

        for (var i = 0; i < data.length; i ++) {
          var clas = i.toString();
          musicTemplate.find('img').attr('src', data[i].picture);
          musicTemplate.find('.music-title').text(data[i].title + ' - ' + data[i].etherum + ' eth');
          musicTemplate.find('.music-artist').text(data[i].artist + ' - ' + data[i].contributors + ' contributors');
          musicTemplate.find('.music-date').text(data[i].date);
          musicTemplate.find('.btn-adopt').attr('data-id', data[i].id).removeClass().addClass('btn btn-download btn-adopt').addClass(clas); //modification des classes de chaque bouton "download" afin de les identifier les uns par rapport aux autres lors du clique

          musicRow.append(musicTemplate.html());
        }
      });

      self.refreshBalance();
    });
  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    var test = $('#test1');
    test.find('.test').addClass('alert alert-info');
    status.innerHTML = message;
  },

  refreshBalance: function() {
    var self = this;

    var meta;
    Royalether.deployed().then(function(instance) {
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

  /// Fonction permettant l'ajout d'une oeuvre ///

  upload: function() {
    var amount = parseInt(document.getElementById("price").value);  // On récupère le prix de l'oeuvre fixé par l'artiste
    var nombre_artiste = parseInt(document.getElementById("contributors").value); // on récupère le nombre  de contributeurs à l'oeuvre qui recevront alors des éther à chaque download

    console.log(amount);
    console.log(nombre_artiste);

  },

  /// Fonction permettant l'envoi d'Ether aux artistes concernés ///

  sendCoin: function(e) {
    var self = this;
    console.log(self);

    var button_all_class = e.getAttribute('class'); // on récupère les classes du bouton "download" cliqué
    var button_class = button_all_class.substr(27); // on isole la dernière classe qui correspond à l'id de l'oeuvre dans le JSON
    console.log(button_class);


    /// Déclaration des variables nécessaires à la transaction ///
    var amount=0;
    var nombre_artiste = 0;
    var result = {amount: amount, nombre_artiste: nombre_artiste};

    this.setStatus("Initiating transaction... (please wait)");
    //console.log(receiver);
    var meta;
    Royalether.deployed().then(function(instance) {
      console.log(instance);
      meta = instance;

      /// Accès au JSON pour identifier l'oeuvre impliquée dans la transaction ///

      $.getJSON('app/music.json', function(data) {
        var musicTemplate = $('#musicTemplate');

        for (var i = 0; i < data.length; i ++) { // on parcourt l'ensemble des oeuvres
          if(button_class == parseInt(i)) // on identifie l'oeuvre correspondant au bouton cliqué
          {
            amount = data[i].etherum; // on affecte la valeur du montant de l'oeuvre au prix de la transaction
            nombre_artiste = data[i].contributors; // on affecte le nombre de contributeurs au nombre de bénéficiaires de la transaction
            console.log("prix=" +amount);
            console.log("contrib=" +nombre_artiste);
          }
        }
        var result = {amount: amount, nombre_artiste: nombre_artiste}; // on regroupe les deux variables
        return result; // on retourne les deux variables
     });

      setTimeout(function () {  //on met un délai à cause du caractère asynchrone du "$.getJSON"
      var receiver = new Array(nombre_artiste);

      for(var i=0;i<nombre_artiste;i++){ // on parcourt l'ensemble des comptes de testRPC
          receiver[i] = accounts[i+1]; // on sélectionne le bon nombres de bénéficiaires en leur attribuant leur addresse publique
        }
           meta.sendCoin(receiver, amount, {from: account}); // on effectue la transaction avec le bon montant
           window.location.reload(); // on recharge la page afin d'actualiser le nombre d'éther de l'utilisateur
          }, 3000);
        }).then(function() {
          self.setStatus("Transaction complete!")
          self.refreshBalance();
        }).catch(function(e) {
          console.log(e);
          self.setStatus("Error sending coin; see log.");
        });
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 Royalether, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();

});
