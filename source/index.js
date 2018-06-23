const Configuration = require("./Configuration.js");
const { configure: configureButtercup } = require("./buttercup.js");
const { configure: configureRaw } = require("./object.js");

module.exports = {
    Configuration,
    configureButtercup,
    configureRaw
};
