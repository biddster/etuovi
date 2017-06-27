const l = require('winston');
l.cli();
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const scanners = {};
let length = 0;

module.exports = {
    load() {
        fs.readdirSync('./lib/scanners').filter(file => file.endsWith('.js')).forEach(file => {
            const name = file.split('.')[0];
            length = Math.max(length, name.length);
            scanners[name] = require('./' + path.join('scanners', file));
            l.debug(`Loaded scanner [${name}]`);
        });
        Object.freeze(scanners);
    },
    get(scanner) {
        return scanners[scanner];
    },
    formatName(scanner) {
        return _.padEnd(scanner, length);
    }
};