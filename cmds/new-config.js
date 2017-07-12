const l = require('winston');
const scanners = require('../lib/scanners');
const fs = require('fs');
const moment = require('moment');
const _ = require('lodash');

module.exports = {
    command: 'new-config',
    aliases: '',
    describe: 'Generates a new config file',
    builder: _.noop,
    handler: (argv) => {
        l.info('Making config');

        const config = {
            hosts: [{
                host: "www.example.com",
                scanners: _.mapValues(scanners.load(), (scanner) => {
                    return scanner.newConfig();
                })
            }]
        };

        l.info(config);
        const file = `etuovi-config-${moment().format('YYYYMMDD-HHmmss')}.json`;
        fs.writeFileSync(file, JSON.stringify(config, null, 4), 'utf8');
        l.info(`Wrote config file [${file}]`)
        process.exit(0);
    }
};