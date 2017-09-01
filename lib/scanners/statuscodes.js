const l = require('winston');
const Promise = require('bluebird');
const nmap = require('node-nmap');
const _ = require('lodash');
const URI = require('urijs');
const rp = require('request-promise');

module.exports = {
    scan(host, config) {
        const keepBody = _.get(config, 'keepBody', false);
        const promises = _.map(config.paths, (spec) => {
            const options = {
                method: spec.method || 'GET',
                uri: new URI().scheme('https').host(host).path(spec.path).toString(),
                resolveWithFullResponse: true,
                simple: false
            };
            return rp(options).then((response) => {
                l.verbose(response);
                const resp = response.toJSON();
                if (!keepBody) {
                    delete resp.body;
                }
                return {
                    summary: `${options.method} [${options.uri}] actual [${response.statusCode}] expected [${spec.expect}]`,
                    detail: resp
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
                keepBody: false,
                expect: 200
            }]
        };
    }
};