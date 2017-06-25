const scanners = require('./lib/scanners');
const fs = require('fs');
const _ = require('lodash');
const Promise = require('bluebird');

const startTime = new Date().getTime();
const errors = [];

const config = JSON.parse(fs.readFileSync('example-config.json', 'utf8'));
const allHosts = _.map(config.hosts, (host) => {
    console.log(`Scanning host [${host.host}]`);
    const hostScanners = _.map(host.scanners, (scannerConfig, scannerName) => {
        console.log(`Running scanner [${scannerName}] against host [${host.host}]`);
        let record = {
            host: host.host,
            scanner: scannerName,
            time: startTime
        };
        return scanners[scannerName](host.host, scannerConfig)
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
                console.log(`Finished scanner [${scannerName}] against host [${host.host}]`);
            });
    });
    return Promise.all(hostScanners).then((results) => {
        console.log(results);
        console.log(`Scanning host [${host.host}] complete`);
    });
});

Promise.all(allHosts).catch((err) => {
    console.log(err);
}).finally(() => {
    console.log(`Exiting with code [${errors.length}]`);
    process.exit(errors.length);
});