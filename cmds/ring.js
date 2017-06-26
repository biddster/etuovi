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
    command: 'ring [config]',
    aliases: '',
    describe: '',
    builder: _.noop,
    handler: (argv) => {
        l.level = _.get(argv, 'log-level', 'info');
        const startTime = new Date().getTime();
        const errors = [];

        scanners.load();

        const config = JSON.parse(fs.readFileSync(argv.config, 'utf8'));
        const allHosts = _.map(config.hosts, (host) => {
            l.info(`Scanning host [${host.host}]`);
            const hostScanners = _.map(host.scanners, (scannerConfig, scannerName) => {
                l.info(`Running scanner [${scannerName}] against host [${host.host}]`);
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
                            summary: err.message,
                            detail: {
                                message: err.message,
                                fileName: err.fileName,
                                lineNumber: err.lineNumber
                            }
                        });
                        return record;
                    }).finally(() => {
                        l.info(`Finished scanner [${scannerName}] against host [${host.host}]`);
                    });
            });
            return Promise.all(hostScanners).then((results) => {
                l.info(`Scanning host [${host.host}] complete`);
                return results;
            });
        });

        return Promise.all(allHosts)
            .then((allHostsResults) => {
                l.info('###### RESULTS');
                allHostsResults.forEach((hostResults) => {
                    hostResults.forEach((hostResult) => {
                        l.info(`[${hostResult.host}] ${hostResult.scanner}: ${hostResult.summary}`);
                        fs.writeFileSync(`${reportsDir}/${hostResult.host}__${hostResult.scanner}__${moment(startTime).format('YYYYMMDD__HHmmss')}.json`,
                            JSON.stringify(hostResult, null, 4), 'utf8');
                    });
                });
            })
            .catch((err) => {
                l.info(err);
            });
    }
};