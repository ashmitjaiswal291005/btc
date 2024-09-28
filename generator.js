"use strict";

process.title = "Bitcoin Stealer by Michal2SAB";

const crypto = require('crypto');
const fs = require('fs');
const CoinKey = require('coinkey');

let addresses = new Map();

// Load addresses from riches.txt
const data = fs.readFileSync('./riches.txt', 'utf8');
data.split('\n').forEach((address) => addresses.set(address.trim(), true)); // .trim() ensures no extra whitespace

let scannedCount = 0;

// Function to generate a random private key
function generatePrivateKey() {
  return crypto.randomBytes(32).toString('hex');
}

// Function to create key pair from private key
function createKeyPair(privateKeyHex) {
  const ck = new CoinKey(Buffer.from(privateKeyHex, 'hex'));
  ck.compressed = false;
  return ck;
}

// Function to check if the wallet's public address matches any from riches.txt
function checkWallet(ck) {
  if (addresses.has(ck.publicAddress)) {
    console.log('\x07'); // Terminal bell
    console.log('\x1b[32m%s\x1b[0m', `>> Success: ${ck.publicAddress}`);
    const successString = `Wallet: ${ck.publicAddress}\n\nSeed: ${ck.privateWif}`;
    fs.writeFileSync('./Success.txt', successString);
    process.exit(); // Exit the program if a match is found
  }
}

// Print the number of wallets scanned every 10 seconds
setInterval(() => {
  console.log(`Scanned ${scannedCount} wallets so far...`);
}, 10000);

// Main function to generate, check, and count wallets
function generate() {
  // Generate a random private key
  const privateKeyHex = generatePrivateKey();
  
  // Create new Bitcoin key pair
  const ck = createKeyPair(privateKeyHex);
  
  // Check if this wallet matches any from the riches.txt file
  checkWallet(ck);
  
  // Increment the scanned wallet count
  scannedCount++;
  
  // Continue the process asynchronously
  setImmediate(generate);
}

// Start the wallet generation process
console.log("\x1b[32m%s\x1b[0m", ">> Program Started and is working silently (edit code if you want logs)");
generate();
