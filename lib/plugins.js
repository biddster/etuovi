const l = require('winston');
const fs = require('fs');
const path = require('path');
const plugins = {
    scanners: {},
    outputs: {}
};
let length = 0;

module.exports = {
    load() {
        Object.keys(plugins).forEach(dir => {
            fs.readdirSync(path.join(__dirname, dir)).filter(file => file.endsWith('.js')).forEach(file => {
                const name = file.split('.')[0];
                length = Math.max(length, name.length);
                plugins[dir][name] = require('./' + path.join(dir, file));
                l.debug(`Loaded scanner [${name}]`);
            });
        });

        Object.freeze(plugins);
        return plugins;
    },
    getScanner(scanner) {
        return plugins.scanners[scanner];
    },
    getOutput(output) {
        return plugins.outputs[output];
    }
};