const merge = require("merge");

function createConfig(configObject, template = {}) {
    const base = merge.recursive({}, template);
    return merge.recursive(
        base,
        configObject
    );
}

module.exports = {
    createConfig
};
