const headers = require(`security-headers`);
const Promise = require('bluebird');
const _ = require('lodash');

module.exports = {
    scan(host, config) {
        // return request(host);
        return Promise.resolve(headers(host, true, true)).then(report => {
            const missingHeaders = _.keys(report.missingHeaders);
            const warnings = _.keys(report.warnings);
            return {
                summary: `Found [${missingHeaders.length}] missing headers [${missingHeaders}] and [${warnings.length}] warnings [${warnings.join(',')}]`,
                detail: report
            };
        });
    }
}