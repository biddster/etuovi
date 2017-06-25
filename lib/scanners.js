const l = require('winston');
const fs = require('fs');
const path = require('path');

const scanners = {};

module.exports = {
    load() {
        fs.readdirSync('./lib/scanners').filter(file => file.endsWith('.js')).forEach(file => {
            const name = file.split('.')[0];
            scanners[name] = require('./' + path.join('scanners', file));
            l.debug(`Loaded scanner [${name}]`);
        });
        Object.freeze(scanners);
    },
    get(scanner) {
        return scanners[scanner];
    }
};