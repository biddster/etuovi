const l = require('winston');

const scanners = require('./lib/scanners');
const fs = require('fs');
const _ = require('lodash');
const Promise = require('bluebird');

const startTime = new Date().getTime();
const errors = [];

scanners.load();

const config = JSON.parse(fs.readFileSync('example-config.json', 'utf8'));
const allHosts = _.map(config.hosts, (host) => {
    l.info(`Scanning host [${host.host}]`);
    const hostScanners = _.map(host.scanners, (scannerConfig, scannerName) => {
        l.info(`Running scanner [${scannerName}] against host [${host.host}]`);
        let record = {
            host: host.host,
            scanner: scannerName,
            time: startTime
        };
        return scanners.get(scannerName).scan(host.host, scannerConfig)
            .then((report) => {
                record.report = report;
                return record;
            })
            .catch((err) => {
                errors.push(err);
                record.report = {
                    error: err.message
                }
                return record;
            }).finally(() => {
                l.info(`Finished scanner [${scannerName}] against host [${host.host}]`);
            });
    });
    return Promise.all(hostScanners).then((results) => {
        // l.info(results);
        l.info(`Scanning host [${host.host}] complete`);
    });
});

Promise.all(allHosts).catch((err) => {
    l.info(err);
}).finally(() => {
    l.info(`Exiting with code [${errors.length}]`);
    process.exit(errors.length);
});