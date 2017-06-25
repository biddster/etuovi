const l = require('winston');

const ssllabs = require('node-ssllabs');
const Promise = require('bluebird');
const scan = Promise.promisify(ssllabs.scan);


module.exports = {
    scan(host, config) {
        return scan({
            host,
            fromCache: true,
            maxAge: 23
        }).then(report => {
            l.debug(`ssllabs: host [${host}] grade [${report.endpoints[0].grade}]`);
            return report;
        });
    }
}