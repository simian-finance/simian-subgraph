const SimianToken = artifacts.require("SimianToken");

module.exports = function (deployer) {
    deployer.deploy(SimianToken);
};
