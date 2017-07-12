const l = require('winston');
const Promise = require('bluebird');
const nmap = require('node-nmap');
const _ = require('lodash');
const URI = require('urijs');
const rp = require('request-promise');

module.exports = {
    scan(host, config) {
        const promises = _.map(config.paths, (spec) => {
            const options = {
                method: spec.method || 'GET',
                uri: new URI().scheme('https').host(host).path(spec.path).toString(),
                resolveWithFullResponse: true
            };
            return rp(options).then((response) => {
                l.verbose(response);
                return {
                    summary: `${options.method} [${options.uri}] actual [${response.statusCode}] expected [${spec.expect}]`,
                    detail: response.toJSON()
                };
            });
        });
        return Promise.all(promises).then((results) => {
            return {
                summary: _.flattenDeep(_.map(results, 'summary')),
                detail: _.flattenDeep(_.map(results, 'detail'))
            };
        });
    },
    newConfig() {
        return {
            paths: [{
                path: '/',
                method: 'GET',
                expect: 200
            }]
        };
    }
};