# buttercup-config
Configuration utility

[![Build Status](https://travis-ci.org/buttercup/buttercup-config.svg?branch=master)](https://travis-ci.org/buttercup/buttercup-config)

## About
This library provides tools for configuring Buttercup entities and applications. Buttercup Archives, Groups and Entries can be configured easily, as well as raw objects for general application support (settings pages etc.).

## Installation
Run `npm install @buttercup/config --save` to install and save the library.

## Usage
Configuring Buttercup entities is easy:

```javascript
const { Archive } = require("buttercup");
const { configureButtercup } = require("@buttercup/config");

const archive = Archive.createWithDefaults();
const config = configureButtercup(archive);
config.set("test.value", 123);
config.apply();
```

Use the `configureButtercup(entity)` method to configure instances, and use the `config#apply()` method to apply the configuration (write it to the instance). Buttercup configurations are stored using attribute values.

Objects are written in a nested manner, whilst arrays are written directly. This means that objects can be composed and merged (especially during merge conflicts), but arrays are overwritten (including nested objects). It is therefore advised to keep configurations simple: Use nestedness sparingly and expect that arrays will never be merged.
