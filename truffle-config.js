const dotenv = require("dotenv").config();
const HdWalletProvider = require("@truffle/hdwallet-provider");

const MNEMONIC = process.env.MNEMONIC;
const BSC_TESTNET = new HdWalletProvider(MNEMONIC, process.env.BSC_PROVIDER);


module.exports = {
  networks: {
    development: {
     host: "127.0.0.1",
     port: 7545,     
     network_id: "*",   
    },
    
    bsc_testnet: {
      provider: BSC_TESTNET,
      network_id: 97,
      skipDryRun: true
    }
  },
  compilers: {
    solc: {
      version: "0.5.1",
    }
  }
};