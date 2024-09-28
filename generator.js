"use strict";

process.title = "Bitcoin Stealer by Michal2SAB";

const crypto = require('crypto');
const fs = require('fs');
const CoinKey = require('coinkey');

let privateKeyHex, ck, addresses;
addresses = new Map();

const data = fs.readFileSync('./riches.txt', 'utf8');
data.split('\n').forEach((address) => addresses.set(address, true));

let scannedCount = 0;

function generatePrivateKey() {
  return crypto.randomBytes(32).toString('hex');
}

function createKeyPair(privateKeyHex) {
  const ck = new CoinKey(Buffer.from(privateKeyHex, 'hex'));
  ck.compressed = false;
  return ck;
}

function checkWallet(ck) {
  if (addresses.has(ck.publicAddress)) {
    console.log('');
    process.stdout.write('\x07');
    console.log('\x1b[32m%s\x1b[0m', `>> Success: ${ck.publicAddress}`);
    const successString = `Wallet: ${ck.publicAddress}\n\nSeed: ${ck.privateWif}`;
    fs.writeFileSync('./Success.txt', successString);
    process.exit();
  }
  scannedCount++;
}

setInterval(() => {
  console.log(`Scanned ${scannedCount} addresses so far...`);
}, 10000);

function generate() {
  // generate random private key hex
  let privateKeyHex = generatePrivateKey();

  // create new bitcoin key pairs
  let ck = createKeyPair(privateKeyHex);

  ck.compressed = false;
  //console.log(ck.publicAddress)
  // Remove "//" in line above if you wanna see the logs, but remember it's gonna slow down the process a lot

  // if generated wallet matches any from the riches.txt file, tell us we won!
  checkWallet(ck);

  // destroy the objects
  ck = null;
  privateKeyHex = null;
}

console.log("\x1b[32m%s\x1b[0m", ">> Program Started and is working silently (edit code if you want logs)"); // don't trip, it's working
// run forever
while(true){
  generate();
  if (process.memoryUsage().heapUsed / 1000000 > 2000) {
    global.gc();
  }
  //console.log("Heap used : ", process.memoryUsage().heapUsed / 1000000);
}
