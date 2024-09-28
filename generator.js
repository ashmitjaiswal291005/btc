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
}

setInterval(() => {
  console.log(`Scanned ${scannedCount} wallets so far...`);
}, 10000);

function generate() {
  // generate random private key hex
  let privateKeyHex = generatePrivateKey();
  
  // create new bitcoin key pairs
  let ck = createKeyPair(privateKeyHex);
  
  ck.compressed = false;
  
  // Check if generated wallet matches any from the riches.txt file
  checkWallet(ck);
  scannedCount++;
  
  // destroy the objects
  ck = null;
  privateKeyHex = null;

  // Run the next iteration asynchronously to avoid blocking the event loop
  setImmediate(generate);
}

console.log("\x1b[32m%s\x1b[0m", ">> Program Started and is working silently (edit code if you want logs)");

// Start the generation loop asynchronously
generate();
