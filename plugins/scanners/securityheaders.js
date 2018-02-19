const l = require('winston');
const headers = require(`security-headers`);
const Promise = require('bluebird');
const _ = require('lodash');
const URI = require('urijs');
const util = require('util');

module.exports = {
    scan(host, config) {
        const paths = config.paths || ['/'];
        const promises = _.map(paths, path => {
            return Promise.resolve(
                headers(
                    new URI()
                        .scheme('https')
                        .host(host)
                        .path(path)
                        .toString(),
                    true,
                    true
                )
            ).then(report => {
                l.verbose(report);
                const missingHeaders = _.keys(report.missingHeaders);
                const warnings = _.keys(report.warnings);
                return {
                    summary: [
                        util.format(
                            '[%s] Score [%s] found [%s] missing headers [%s] and [%d] warnings [%s]',
                            path,
                            report.score,
                            missingHeaders.length,
                            missingHeaders,
                            warnings.length,
                            warnings.join(',')
                        )
                    ],
                    detail: report,
                    alert: config.expect ? config.expect === report.score : false
                };
            });
        });
        return Promise.all(promises).then(results => {
            return {
                summary: _.flattenDeep(_.map(results, 'summary')),
                detail: _.flattenDeep(_.map(results, 'detail'))
            };
        });
    },
    newConfig() {
        return {
            expect: 'A'
        };
    }
};
