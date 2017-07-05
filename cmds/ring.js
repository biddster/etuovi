const l = require('winston');
const scanners = require('../lib/scanners');
const fs = require('fs');
const moment = require('moment');
const _ = require('lodash');
const Promise = require('bluebird');
const mkdirp = require('mkdirp');

const reportsDir = 'reports';
mkdirp(reportsDir);

module.exports = {
    command: 'ring <config>',
    aliases: '',
    describe: '',
    builder: _.noop,
    handler: (argv) => {
        const startTime = new Date().getTime();
        const errors = [];

        scanners.load();

        const config = JSON.parse(fs.readFileSync(argv.config, 'utf8'));
        const allHosts = _.map(config.hosts, (host) => {
            l.info(`Scanning host [${host.host}]`);
            const hostScanners = _.map(host.scanners, (scannerConfig, scannerName) => {
                l.info(`Running scanner [${scanners.formatName(scannerName)}] against host [${host.host}]`);
                const record = {
                    host: host.host,
                    scanner: scannerName,
                    time: startTime
                };
                return scanners.get(scannerName).scan(host.host, scannerConfig)
                    .then((report) => {
                        _.assign(record, report);
                        return record;
                    })
                    .catch((err) => {
                        errors.push(err);
                        _.assign(record, {
                            summary: _.isString(err) ? err : err.message,
                            detail: {
                                message: err.message,
                                fileName: err.fileName,
                                lineNumber: err.lineNumber
                            }
                        });
                        return record;
                    }).finally(() => {
                        l.info(`Finished scanner [${scanners.formatName(scannerName)}] against host [${host.host}]`);
                    });
            });
            return Promise.all(hostScanners).then((results) => {
                l.info(`Scanning host [${host.host}] complete`);
                return results;
            });
        });

        return Promise.all(allHosts)
            .then((allHostsResults) => {
                l.info('###### SUMMARY');
                const files = [];
                allHostsResults.forEach((hostResults) => {
                    l.info(`[${hostResults[0].host}]`);
                    hostResults.forEach((hostResult) => {
                        l.info(`    ${scanners.formatName(hostResult.scanner)} => ${hostResult.summary}`);
                        const file = `${reportsDir}/${hostResult.host}__${hostResult.scanner}__${moment(startTime).format('YYYYMMDD__HHmmss')}.json`;
                        fs.writeFileSync(file, JSON.stringify(hostResult, null, 4), 'utf8');
                        files.push(file);
                    });
                });
                l.info('###### REPORTS');
                files.forEach(file => l.info(`${file}`));
            })
            .catch((err) => {
                l.info(err);
                errors.push(err);
            })
            .finally(() => {
                process.exit(errors.length);
            });
    }
};