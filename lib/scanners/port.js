const Promise = require('bluebird');
const Evilscan = require('evilscan');
const dns = require('dns');

module.exports = {
    scan(host, config) {
        return new Promise(function (resolve, reject) {
            dns.lookup(host, function (err, ip) {
                if (err) {
                    reject(err);
                    return;
                }
                const options = {
                    target: ip,
                    port: config.ports,
                    status: 'TROU', // Timeout, Refused, Open, Unreachable
                    banner: false
                };
                const scanner = new Evilscan(options);
                const report = [];
                scanner.on('result', function (data) {
                    // fired when item is matching options
                    // if (data.status.indexOf('closed') === -1) {
                    // console.log(data);
                    // }
                    report.push(data);
                }).on('error', function (err) {
                    reject(err);
                }).on('done', function () {
                    resolve(report);
                });
                scanner.run();
            });
        });
    }
}