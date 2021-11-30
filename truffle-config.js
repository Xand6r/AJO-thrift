const path = require("path");
const HDWalletProvider = require("truffle-hdwallet-provider");
const {mnemonic, infuraApiKey} = require('./keys.json');


module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 8545
    },
    rinkeby: {
      networkCheckTimeout: 10000,
      confirmations: 10,
      timeoutBlocks: 2000,
      skipDryRun: true,
      provider: function() {
        return new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraApiKey}`)
      },
      network_id: 4,
      gas: 4000000      //make sure this gas allocation isn't over 4M, which is the max
    }
  },
  compilers: {
    solc: {
      version: "^0.8.3"
    }
  }
};
