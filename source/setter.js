const NUMBER = /^\d+$/;
const SPLIT_PLACEHOLDER = "__BCUP_CONFIG_SPLITTER__";

function keyToComponents(key) {
    const exp = /([^\\])\./g;
    const prepared = key
        .replace(exp, match => {
            return match[0] + SPLIT_PLACEHOLDER;
        })
        .replace("\\.", ".");
    return prepared.split(SPLIT_PLACEHOLDER);
}

function setDeep(obj, key, value) {
    if (/^(_|\d+)\./.test(key)) {
        throw new Error("Unable to set value: Key cannot start with an array index");
    }
    const set = (currentObj, keyParts) => {
        const newParts = [...keyParts];
        const keyPartRaw = newParts.shift();
        const thisKeyPart = NUMBER.test(keyPartRaw) ? parseInt(keyPartRaw, 10) : keyPartRaw;
        if (newParts.length > 0) {
            // still items left
            const valueToInsert = currentObj[thisKeyPart] || {};
            currentObj[thisKeyPart] = valueToInsert;
            set(currentObj[thisKeyPart], newParts);
        } else {
            // last key part
            currentObj[thisKeyPart] = value;
        }
    };
    const components = keyToComponents(key);
    set(obj, components);
}

module.exports = {
    keyToComponents,
    setDeep
};
