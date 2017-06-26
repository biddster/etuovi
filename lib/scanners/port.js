const Promise = require('bluebird');
const Evilscan = require('evilscan');
const dns = require('dns');
const _ = require('lodash');

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
                    report.push(data);
                }).on('error', function (err2) {
                    reject(err2);
                }).on('done', function () {
                    const openPorts = _(report).filter(['status', 'open']).map('port').sort((a, b) => a - b).value();
                    resolve({
                        summary: `Found [${openPorts.length}] open ports [${openPorts.join(',')}]`,
                        detail: report
                    });
                });
                scanner.run();
            });
        });
    }
}