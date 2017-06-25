const fs = require('fs');
const path = require('path');

const scanners = {};

module.exports = {
    load() {
        fs.readdirSync('./lib/scanners').filter(file => file.endsWith('.js')).forEach(file => {
            const name = file.split('.')[0];
            scanners[name] = require('./' + path.join('scanners', file));
        });
        Object.freeze(scanners);
    },
    locate(scanner) {
        return scanners[scanner];
    }
};