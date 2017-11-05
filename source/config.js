const merge = require("deepmerge");

function createConfig(configObject, template = {}) {
    return merge(
        template,
        configObject
    );
}

module.exports = {
    createConfig
};
