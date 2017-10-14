

const DAC = artifacts.require("./DAC.sol");
const TitleToken = artifacts.require("./TitleToken.sol");

module.exports = function(deployer) {
  deployer.deploy(DAC);
  deployer.deploy(TitleToken);
};
