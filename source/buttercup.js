const Configuration = require("./Configuration.js");

const CONFIG_KEY_PREFIX = "BCUP_CONFIG_VALUE_";

function applyConfiguration(item, configuration) {
    const list = objectToKeyList(configuration.config);
    const existingAttributes = item.getAttributes();
    // First remove all now non-existent attributes
    Object.keys(existingAttributes).forEach(attribute => {
        const strippedKey = attribute.substr(CONFIG_KEY_PREFIX.length);
        if (list.hasOwnProperty(strippedKey) === false) {
            item.deleteAttribute(attribute);
        }
    });
    // Overwrite/set all the still-present values
    Object.keys(list).forEach(key => {
        const attributeName = `${CONFIG_KEY_PREFIX}${key}`;
        item.setAttribute(attributeName, encodeValue(list[key]));
    });
}

function configure(item, template = {}) {
    const attributes = item.getAttributes();
    const configuration = new Configuration({}, template);
    Object
        .keys(attributes)
        .filter(key => key.indexOf(CONFIG_KEY_PREFIX) === 0)
        .forEach(key => {
            const setterKey = key.substr(CONFIG_KEY_PREFIX.length);
            configuration.set(setterKey, decodeValue(attributes[key]));
        });
    configuration.applicator = () => {
        applyConfiguration(item, configuration);
    };
    return configuration;
}

function decodeValue(val) {
    return JSON.parse(val);
}

function encodeValue(val) {
    return JSON.stringify(val);
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
    decodeValue,
    encodeValue,
    escapeKey,
    objectToKeyList
};
