const l = require('winston');
const path = require('path');
const requireAll = require('require-all');
const _ = require('lodash');

const plugins = {
    scanners: {},
    outputs: {}
};

module.exports = {
    load: _.once(function() {
        Object.keys(plugins).forEach(dir => {
            plugins[dir] = requireAll(path.join(__dirname, dir));
            l.debug(`Loaded plugins [${Object.keys(plugins[dir])}] from directory [${dir}]`);
        });
        // Object.freeze(plugins);
        return plugins;
    }),
    getScanner(scanner) {
        return plugins.scanners[scanner];
    },
    getOutput(output) {
        return plugins.outputs[output];
    },
    addScanner(scanner, impl) {
        plugins.scanners[scanner] = impl;
    }
};
