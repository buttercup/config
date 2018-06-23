const Configuration = require("./Configuration.js");

/**
 * Apply a configuration to an object
 * @param {Object} item The target object
 * @param {Configuration} configuration The config instance
 */
function applyConfiguration(item, configuration) {
    const mergeObjects = (target, source) => {
        Object.keys(source).forEach(sourceKey => {
            const value = source[sourceKey];
            if (Array.isArray(value)) {
                target[sourceKey] = [...value];
            } else if (typeof value === "object" && value !== null) {
                target[sourceKey] = target[sourceKey] || {};
                mergeObjects(target[sourceKey], value);
            } else {
                target[sourceKey] = value;
            }
        });
    };
    mergeObjects(item, configuration.config);
}

function configure(item, template = {}) {
    const cloned = JSON.parse(JSON.stringify(item));
    if (typeof cloned !== "object" || cloned === null) {
        throw new Error("Failed configuring item: Item not an object");
    }
    const configuration = new Configuration(cloned, template);
    configuration.applicator = () => {
        applyConfiguration(item, configuration);
    };
    return configuration;
}

module.exports = {
    applyConfiguration,
    configure
};
