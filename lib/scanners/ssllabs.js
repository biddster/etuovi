const l = require('winston');
l.cli();
const ssllabs = require('node-ssllabs');
const Promise = require('bluebird');
const fs = require('fs');
const scan = Promise.promisify(ssllabs.scan);


module.exports = {
    scan(host, config) {
        return scan({
            host,
            fromCache: true,
            maxAge: 23
        }).then(report => {
            // l.debug(`ssllabs: host [${host}] grade [${report.endpoints[0].grade}]`);
            const protocols = report.endpoints[0].details.protocols.map((protocol) => protocol.name + protocol.version).join(',');
            return {
                summary: `Grade [${report.endpoints[0].grade}] Cert expires [${new Date(report.endpoints[0].details.cert.notAfter).toUTCString()}] Protocols [${protocols}]`,
                detail: report
            };
        });
    }
};