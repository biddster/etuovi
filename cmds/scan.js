const l = require('winston');
const scanners = require('../lib/scanners');
const fs = require('fs');
const moment = require('moment');
const _ = require('lodash');
const Promise = require('bluebird');
const mkdirp = require('mkdirp');

const reportsDir = 'reports';
mkdirp.sync(reportsDir);

module.exports = {
    command: 'scan <config>',
    aliases: '',
    describe: 'asdf asdf asfa dfsadfd',
    builder: _.noop,
    handler: (argv) => {
        const startTime = new Date().getTime();
        const errors = [];

        scanners.load();

        const config = JSON.parse(fs.readFileSync(argv.config, 'utf8'));
        const allHosts = _.map(config.hosts, (host) => {
            l.info(`Knocking the front door of host [${host.host}]`);
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
                            summary: _.isString(err) ? err : err.message,
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
                const masterReport = {
                    hosts: [],
                    reports: []
                };
                allHostsResults.forEach((hostResults) => {
                    const hostData = {
                        host: hostResults[0].host,
                        scanners: {}
                    };
                    hostResults.forEach((hostResult) => {
                        hostData.scanners[hostResult.scanner] = [];
                        _.each(_.isArray(hostResult.summary) ? hostResult.summary : [hostResult.summary], (summary) => {
                            hostData.scanners[hostResult.scanner].push(summary);
                        });
                        masterReport.reports.push(writeJsonReport(`${hostResult.host}__${hostResult.scanner}`, hostResult));
                    });
                    masterReport.hosts.push(hostData);
                });
                const masterReportFile = writeJsonReport('scan__report', masterReport);
                l.info(`Complete: ${masterReportFile}\n${JSON.stringify(masterReport, null, 4)}`);
            })
            .catch((err) => {
                l.info(err);
                errors.push(err);
            })
            .finally(() => {
                process.exit(errors.length);
            });

        function writeJsonReport(reportName, data) {
            const file = `${reportsDir}/etuovi__${reportName}__${moment(startTime).format('YYYYMMDD__HHmmss')}.json`;
            fs.writeFileSync(file, JSON.stringify(data, null, 4), 'utf8');
            return file;
        }
    }
};