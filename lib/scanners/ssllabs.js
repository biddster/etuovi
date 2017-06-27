const l = require('winston');
const ssllabs = require('node-ssllabs');
const Promise = require('bluebird');
const scan = Promise.promisify(ssllabs.scan);
const _ = require('lodash');

module.exports = {
    scan(host, config) {
        const options = _.assign({
            host,
            fromCache: true,
            maxAge: 23
        }, config);
        l.verbose(`ssllabs: ${JSON.stringify(options)}`);
        return scan(options).then(report => {
            // l.debug(`ssllabs: host [${host}] grade [${report.endpoints[0].grade}]`);
            const protocols = report.endpoints[0].details.protocols.map((protocol) => protocol.name + protocol.version).join(',');
            return {
                summary: `Grade [${report.endpoints[0].grade}] Cert expires [${new Date(report.endpoints[0].details.cert.notAfter).toUTCString()}] Protocols [${protocols}]`,
                detail: report
            };
        });
    }
};