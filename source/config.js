const merge = require("deepmerge");

function createConfig(configObject, template = {}) {
    return merge(
        sanitiseObject(template),
        sanitiseObject(configObject)
    );
}

function sanitiseObject(obj) {
    return Object
        .keys(obj)
        .filter(key => typeof obj[key] !== "object")
        .reduce((output, key) => {
            output[key] = obj[key];
            return output;
        }, {});
}
