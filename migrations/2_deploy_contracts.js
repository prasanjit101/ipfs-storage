const StorageContract = artifacts.require("StorageContract");

module.exports = function (deployer) {
  deployer.deploy(StorageContract);
};
