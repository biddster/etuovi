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
        const plugin = plugins.scanners[scanner];
        if (!plugin) throw new Error(`No such scanner loaded [${scanner}]`);
        return plugin;
    },
    getOutput(output) {
        const plugin = plugins.outputs[output];
        if (!plugin) throw new Error(`No such output loaded [${output}]`);
        return plugin;
    },
    addScanner(scanner, impl) {
        plugins.scanners[scanner] = impl;
    },
    addOutput(output, impl) {
        plugins.outputs[output] = impl;
    }
};
