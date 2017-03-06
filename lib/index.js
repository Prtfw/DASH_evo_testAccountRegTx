var bitcore = require('./../../bitcore-lib-dash/index.js');
bitcore.Networks.defaultNetwork = bitcore.Networks.testnet;

var Transaction = bitcore.Transaction;
var HDPrivateKey = bitcore.HDPrivateKey;
// var Peer = require('bitcore-p2p-dash').Peer;
// var Messages = require('bitcore-p2p-dash').Messages;

var WIF = '74707276385a67784d426963514b735064314376335453626d32476233375964516657504b46326f6b63384a76697a327a356f6865467948335a576937436d39624d48463553624155716b4e374c7032776b724b7263763257446d73744679485276677552554a6d37327a65647654';
var hdPrivateKey = new HDPrivateKey(new Buffer(WIF, 'hex'));

var derivedChange = hdPrivateKey.derive("m/1'");
var changeAddress = derivedChange.privateKey.toAddress();

var address = "yiPF1uYZnYoMYQtgWD929jdMXumFSnXyce"; // Dash Core Wallet
var amount = 100000000;
var INSTANTSEND_MIN_FEE = 200000;

var opts = {
    Action: 0, // register
    Type: 0, // user
    AccKey: 'snogcel',
    PubKey: hdPrivateKey.toString()
};

// https://test-insight.dash.org/api/addr/yM9TNxUo9xMPvPPxXLde9ZjxHFG9JYzagS/utxo
var utxo = new bitcore.Transaction.UnspentOutput({
    "txid" : "4e6faacd46cabb69c3f82a82e87c59d494917155f44fba16daa3ec99e4204d21",
    "vout" : 1,
    "address" : "yM9TNxUo9xMPvPPxXLde9ZjxHFG9JYzagS",
    "scriptPubKey" : "76a914091468a6af27205c252546370b457884e63419d388ac",
    "satoshis" : 95874240000
});

// Note: this resulted in txid: fc431a20716c6a25a6eede5ad1107c34827a2ccf2df4df16d0a4dbcc5014d22c
// https://test-insight.dash.org/api/tx/fc431a20716c6a25a6eede5ad1107c34827a2ccf2df4df16d0a4dbcc5014d22c
// note the 'txlock' attribute, indicating the InstantSend was successful

var transaction = new Transaction()
    .from(utxo)          // Feed information about what unspent outputs one can use
    .to(address, amount)  // Add an output with the given amount of satoshis
    .change(changeAddress)      // Sets up a change address where the rest of the funds will go
    .addData(JSON.stringify(opts))  //Maddie added this ONE line
    .fee(INSTANTSEND_MIN_FEE)
    .sign(derivedChange.privateKey);     // Signs all the inputs it can

var txSerialized = transaction.serialize(true);
console.log(transaction.toObject());    //Maddie: for debugging
var scriptOut = bitcore.Script(transaction.toObject().outputs[0].script); //Maddie: for debugging
console.log(scriptOut); //Maddie: for debugging
console.log(txSerialized);
//console.log("Change Address: "+changeAddress);

/*
var messages = new Messages({
    Transaction: bitcore.Transaction,
    TXLockRequest: bitcore.Transaction
});

var peer = new Peer({ host: '127.0.0.1', network: 'testnet' });

peer.on('ready', function() {
    var message = messages.TXLockRequest(transaction);
    peer.sendMessage(message);
});

peer.connect();
*/
