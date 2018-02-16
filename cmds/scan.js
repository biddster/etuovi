const l = require('winston');
const plugins = require('../lib/plugins');
const _ = require('lodash');
const Promise = require('bluebird');
const readFile = Promise.promisify(require('fs').readFile);

module.exports = configFile => {
    const startTime = new Date().getTime();
    const errors = [];

    plugins.load();

    return readFile(configFile, 'utf8').then(contents => {
        const config = JSON.parse(contents);
        const allHosts = _.map(config.hosts, host => {
            l.info(`Scanning host [${host.host}]`);
            const hostScanners = _.map(host.scanners, (scannerConfig, scannerName) => {
                l.info(`Running scanner [${scannerName}] against host [${host.host}]`);
                const record = {
                    host: host.host,
                    scanner: scannerName
                };
                return plugins
                    .getScanner(scannerName)
                    .scan(host.host, scannerConfig)
                    .then(report => {
                        _.assign(record, report);
                        return record;
                    })
                    .catch(err => {
                        errors.push(err);
                        _.assign(record, {
                            summary: [_.isString(err) ? err : err.message],
                            detail: {
                                message: err.message,
                                fileName: err.fileName,
                                lineNumber: err.lineNumber
                            }
                        });
                        return record;
                    })
                    .finally(() => {
                        record.time = new Date().getTime();
                        l.info(`Finished scanner [${scannerName}] against host [${host.host}]`);
                    });
            });
            return Promise.all(hostScanners).then(results => {
                l.info(`Scanning host [${host.host}] complete`);
                return results;
            });
        });

        return Promise.all(allHosts)
            .then(allHostsRecords => {
                const masterReport = {
                    errors: _.map(errors, 'stack'),
                    startTime,
                    hosts: _.map(allHostsRecords, hostRecords => {
                        return {
                            host: hostRecords[0].host,
                            scanners: _.transform(
                                hostRecords,
                                (scanners, hostRecord) => {
                                    scanners[hostRecord.scanner] = _.pick(hostRecord, [
                                        'time',
                                        'summary',
                                        'detail'
                                    ]);
                                },
                                {}
                            )
                        };
                    })
                };
                l.info(`=> RESULTS`);
                masterReport.hosts.forEach(host => {
                    l.info(host.host);
                    _.forEach(host.scanners, (report, name) => {
                        l.info(`    ${name}`);
                        report.summary.forEach(summary => {
                            l.info(`       ${summary}`);
                        });
                    });
                });
                return Promise.all(
                    _.map(config.outputs, (outputConfig, outputName) =>
                        plugins.getOutput(outputName).output(masterReport, outputConfig)
                    )
                ).then(() => {
                    return masterReport;
                });
            })
            .finally(() => {
                l.info(`Scan complete with [${errors.length}] errors`);
                errors.forEach(err => l.error(err));
            });
    });
};
