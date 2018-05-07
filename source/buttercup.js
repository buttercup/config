const Configuration = require("./Configuration.js");

const CONFIG_KEY_PREFIX = "BCUP_CONFIG_VALUE:";

// function getConfigAttributes(item) {
//     const attributes = item.getAttributes();
//     return Object
//         .keys(attributes)
//         .filter(key => key.indexOf(CONFIG_KEY_PREFIX) === 0)
//         .reduce((output, key) => {
//             output[key] = attributes[key];
//             return output;
//         }, {});
// }

// function getConfiguration(item) {
//     const rawAttributes = getConfigAttributes(item);

// }

function configure(item, template = {}) {
    const attributes = item.getAttributes();
    // const attributes = Object
    //     .keys(rawAttributes)
    //     .filter(key => key.indexOf(CONFIG_KEY_PREFIX) === 0)
    //     .reduce((output, key) => {
    //         output[key] = attributes[key];
    //         return output;
    //     }, {});
    const configuration = new Configuration({}, template);
    Object
        .keys(attributes)
        .filter(key => key.indexOf(CONFIG_KEY_PREFIX) === 0)
        // .map(key => key.substr(CONFIG_KEY_PREFIX.length + 1))
        .forEach(key => {
            const setterKey = key.substr(CONFIG_KEY_PREFIX.length);
            configuration.set(setterKey, JSON.parse(attributes[key]));
        });
    return configuration;
}

module.exports = {
    CONFIG_KEY_PREFIX,
    configure
};
