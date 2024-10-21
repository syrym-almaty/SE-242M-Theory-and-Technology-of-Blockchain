// backend/contract.js
const web3 = require('./web3');
const contractABI = require('../build/contracts/Marketplace.json').abi;
const contractAddress = process.env.CONTRACT_ADDRESS;

const contract = new web3.eth.Contract(contractABI, contractAddress);

module.exports = contract;