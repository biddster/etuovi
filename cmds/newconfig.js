const l = require('winston');
const plugins = require('../lib/plugins');
const fs = require('final-fs');
const moment = require('moment');
const _ = require('lodash');

module.exports = () => {
    l.info('Making config');

    const loaded = plugins.load();
    const config = {
        hosts: [
            {
                host: 'www.example.com',
                scanners: _.mapValues(loaded.scanners, plugin => plugin.newConfig())
            }
        ],
        outputs: _.mapValues(loaded.outputs, output => output.newConfig())
    };

    l.info(config);
    const file = `etuovi-config-${moment().format('YYYYMMDD-HHmmss')}.json`;
    return fs.writeJSON(file, config).then(() => {
        l.info(`Wrote config file [${file}]`);
        return file;
    });
};
