var bitcore = require('bitcore-lib-dash');
bitcore.Networks.defaultNetwork = bitcore.Networks.testnet; // uses testnet default

var Transaction = bitcore.Transaction;
var Peer = require('bitcore-p2p-dash').Peer;
var Messages = require('bitcore-p2p-dash').Messages;

var argv = require('minimist')(process.argv.slice(2));
var txSerialized = null;

if (!argv._[0]) {
    console.log("please provide the raw transaction as an argument.");
    process.exit();
} else {
   txSerialized = argv._[0];
}

var transaction = new Transaction(txSerialized);

var messages = new Messages({
    Transaction: bitcore.Transaction,
    TXLockRequest: bitcore.Transaction
});

var peer = new Peer({ host: '127.0.0.1', network: 'testnet' });

peer.on('ready', function() {
    // console.log(txSerialized);
    // console.log(transaction);

    var message = messages.TXLockRequest(transaction);
    peer.sendMessage(message);

    console.log("InstantSend txid: " + transaction.id);
    process.exit();
});

peer.connect();
