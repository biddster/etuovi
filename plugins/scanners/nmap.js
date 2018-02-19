const l = require('winston');
const Promise = require('bluebird');
const nmap = require('node-nmap');
const _ = require('lodash');

module.exports = {
    scan(host, config) {
        return new Promise((resolve, reject) => {
            nmap.nmapLocation = 'nmap';
            const osandports = new nmap.NmapScan(host, config.options);
            osandports.on('complete', report => {
                l.verbose(report);
                const openPorts = _(report[0].openPorts)
                    .map('port')
                    .sort((a, b) => a - b)
                    .value();
                resolve({
                    summary: [
                        `Found [${openPorts.length}] open ports [${openPorts.join(
                            ','
                        )}] against [${report[0].ip}]`
                    ],
                    detail: report[0].openPorts
                });
            });
            osandports.on('error', err1 => {
                reject(_.isString(err1) ? new Error(err1) : err1);
            });
            osandports.startScan();
        });
    },
    newConfig() {
        return {
            expect: '443'
        };
    }
};
