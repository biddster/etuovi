const ssllabs = require('node-ssllabs');
const Promise = require('bluebird');
const scan = Promise.promisify(ssllabs.scan);
const rp = require('request-promise');
const URI = require('urijs');
const Evilscan = require('evilscan');
const dns = require('dns');
// const headers = require(`./security-headers`)

request = rp.defaults({
    resolveWithFullResponse: true,
    simple: true
});

module.exports = {
    ssllabs: function (host, config) {
        return scan({
            host: host,
            fromCache: true,
            maxAge: 23
        }).then(report => {
            console.log(`ssllabs: host [${host}] grade [${report.endpoints[0].grade}]`);
            return report;
        });
    },
    securityheaders: function (host, config) {
        // return request(host);
        return headers(host);
    },
    port: function (host, config) {
        return new Promise(function (resolve, reject) {
            dns.lookup(host, function (err, ip) {
                if (err) return reject(err);
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
            })
        });
    }
};