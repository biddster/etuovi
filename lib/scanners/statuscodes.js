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
            return rp(options).then(function (response) {
                l.verbose(response);
                return {
                    summary: `${options.method} [${options.uri}] actual [${response.statusCode}] expected [${spec.status}]`,
                    detail: response.toJSON()
                };
            });
        });
        return Promise.all(promises).then((results) => {
            return {
                summary: _.map(results, 'summary'),
                detail: _.map(results, 'detail')
            };
        });
    },
    makeConfig() {
        return {
            paths: [{
                path: '/',
                method: 'GET',
                status: 200
            }]
        };
    }
};