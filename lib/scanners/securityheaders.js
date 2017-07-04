const headers = require(`security-headers`);
const Promise = require('bluebird');
const _ = require('lodash');
const URI = require('urijs');

module.exports = {
    scan(host, config) {
        return Promise.resolve(headers(new URI(host).scheme('https').toString(), true, true)).then(report => {
            const missingHeaders = _.keys(report.missingHeaders);
            const warnings = _.keys(report.warnings);
            return {
                summary: `Score [${report.score}] found [${missingHeaders.length}] missing headers [${missingHeaders}] and [${warnings.length}] warnings [${warnings.join(',')}]`,
                detail: report
            };
        });
    }
}