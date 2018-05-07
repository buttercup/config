const EventEmitter = require("eventemitter3");
const dotProp = require("dot-prop");
const clone = require("clone");
const { createConfig } = require("./config.js");
const { setDeep } = require("./setter.js");

function enumerateArray(configInst, key, array) {
    array.forEach(item => {
        configInst.set(`${key}._`, item);
    });
}

function enumerateObject(configInst, key, obj) {
    Object.keys(obj).forEach(subkey => {
        configInst.set(`${key}.${subkey}`, obj[subkey]);
    });
}

class Configuration extends EventEmitter {
    constructor(initial = {}, template = {}) {
        super();
        this._config = createConfig(initial, template);
    }

    get config() {
        return this._config;
    }

    export() {
        return clone(this.config);
    }

    get(key, defaultValue) {
        return dotProp.get(this.config, key, defaultValue);
    }

    set(key, value) {
        if (Array.isArray(value)) {
            enumerateArray(this, key, value);
            return;
        } else if (typeof value === "object" && value !== null) {
            enumerateObject(this, key, value);
            return;
        }
        setDeep(this.config, key, value);
        this.emit("set", { key, value });
    }
}

module.exports = Configuration;
