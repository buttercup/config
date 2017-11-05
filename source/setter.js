const ANONYMOUS_ARRAY_KEY = "_";
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
        const arrayInsertion = keyPartRaw === ANONYMOUS_ARRAY_KEY;
        if (newParts.length > 0) {
            // still items left
            if (NUMBER.test(newParts[0]) || newParts[0] === ANONYMOUS_ARRAY_KEY) {
                // next item is an array value
                const valueToInsert = arrayInsertion ? [] : currentObj[thisKeyPart] || [];
                if (arrayInsertion) {
                    const index = currentObj.push(valueToInsert) - 1;
                    set(currentObj[index], newParts);
                } else {
                    currentObj[thisKeyPart] = valueToInsert;
                    set(currentObj[thisKeyPart], newParts);
                }
            } else {
                // next item is just a property
                const valueToInsert = arrayInsertion ? {} : currentObj[thisKeyPart] || {};
                if (arrayInsertion) {
                    const index = currentObj.push(valueToInsert) - 1;
                    set(currentObj[index], newParts);
                } else {
                    currentObj[thisKeyPart] = valueToInsert;
                    set(currentObj[thisKeyPart], newParts);
                }
            }
        } else {
            // last key part
            if (arrayInsertion) {
                currentObj.push(value);
            } else {
                currentObj[thisKeyPart] = value;
            }
        }
    };
    const components = keyToComponents(key);
    set(obj, components);
}

module.exports = {
    keyToComponents,
    setDeep
};
