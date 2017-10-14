

const TitleToken = artifacts.require("./TitleToken.sol");

module.exports = function(deployer) {
  deployer.deploy(TitleToken);
};
