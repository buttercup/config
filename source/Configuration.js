const EventEmitter = require("eventemitter3");
const dotProp = require("dot-prop");
const clone = require("clone");
const { createConfig } = require("./config.js");
const { setDeep } = require("./setter.js");

function defaultApplicator() {
    throw new Error("Unable to apply configuration: No target set");
}

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
        this._applicator = defaultApplicator;
        this.enumerateObject = enumerateObject;
        this.enumerateArray = enumerateArray;
    }

    get applicator() {
        return this._applicator;
    }

    get config() {
        return this._config;
    }

    set applicator(fn) {
        if (typeof fn !== "function") {
            throw new Error("Invalid applicator: Expected a function");
        }
        this._applicator = fn;
    }

    apply() {
        return this.applicator();
    }

    export() {
        return clone(this.config);
    }

    get(key, defaultValue) {
        return dotProp.get(this.config, key, defaultValue);
    }

    set(key, value) {
        if (Array.isArray(value)) {
            this.enumerateArray(this, key, value);
            return;
        } else if (typeof value === "object") {
            this.enumerateObject(this, key, value);
            return;
        }
        setDeep(this.config, key, value);
        this.emit("set", key, value);
    }
}

module.exports = Configuration;
