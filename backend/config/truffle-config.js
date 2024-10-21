// truffle-config.js
const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

module.exports = {
    networks: {
        rinkeby: {
            provider: () =>
                new HDWalletProvider(
                    process.env.MNEMONIC,
                    `https://${process.env.NETWORK}.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
                ),
            network_id: 4,
            gas: 5500000,
            confirmations: 2,
            timeoutBlocks: 200,
            skipDryRun: true,
        },
    },
    compilers: {
        solc: {
            version: '0.8.0',
        },
    },
};