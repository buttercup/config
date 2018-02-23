const Configuration = require("./Configuration.js");

const CONFIG_KEY_PREFIX = "BCUP_CONFIG_VALUE";

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

function applyConfiguration(item, configuration) {
    const list = objectToKeyList(configuration.config);
}

function configure(item, template = {}) {
    const attributes = item.getAttributes();
    const configuration = new Configuration({}, template);
    Object
        .keys(attributes)
        .filter(key => key.indexOf(CONFIG_KEY_PREFIX) === 0)
        .forEach(key => {
            const setterKey = key.substr(CONFIG_KEY_PREFIX.length + 1);
            configuration.set(setterKey, attributes[key]);
        });
    configuration.applicator = () => {
        applyConfiguration(item, configuration);
    };
    return configuration;
}

function escapeKey(key) {
    return key.replace(/([^\\])\./g, "$1\\\\.");
}

function objectToKeyList(obj, keys = []) {
    return Object
        .keys(obj)
        .reduce((output, nextKey) => {
            const nextValue = obj[nextKey];
            const handleNonArrayValue = (deepKeys, value) => {
                if (typeof value === "object" && value !== null) {
                    Object.assign(output, objectToKeyList(value, deepKeys));
                } else {
                    const finalKey = deepKeys.join(".");
                    output[finalKey] = value;
                }
            };
            const handleArrayValue = (deepKeys, value) => {
                value.forEach((deepValue, index) => {
                    if (Array.isArray(deepValue)) {
                        handleArrayValue([...deepKeys, index], deepValue);
                    } else {
                        handleNonArrayValue([...deepKeys, index], deepValue);
                    }
                });
            };
            if (Array.isArray(nextValue)) {
                handleArrayValue([...keys, escapeKey(nextKey)], nextValue);
            } else {
                handleNonArrayValue([...keys, escapeKey(nextKey)], nextValue);
            }
            return output;
        }, {});
}

module.exports = {
    applyConfiguration,
    configure,
    escapeKey,
    objectToKeyList
};
