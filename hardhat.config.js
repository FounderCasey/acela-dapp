require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.4",
  paths: {
    artifacts: "./src/artifacts",
  },
  networks: {
    hardhat: {},
    ropsten: {
      url: process.env.REACT_APP_INFURA,
      accounts: [process.env.REACT_APP_PRIVATE_KEY],
    },
  },
};
