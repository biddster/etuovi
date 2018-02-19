const l = require('winston');
const Promise = require('bluebird');
const _ = require('lodash');
const URI = require('urijs');
const rp = require('request-promise');

module.exports = {
    scan(host, config) {
        const keepBody = _.get(config, 'keepBody', false);
        const baseHeaders = _.mapKeys(config.headers, (value, header) => header.toLowerCase());
        const promises = _.map(config.paths, spec => {
            const options = {
                method: spec.method || 'GET',
                uri: new URI()
                    .scheme('https')
                    .host(host)
                    .path(spec.path)
                    .toString(),
                resolveWithFullResponse: true,
                simple: false
            };
            return rp(options).then(response => {
                l.verbose(response);
                const summary = [
                    `${options.method} [${options.uri}] actual [${
                        response.statusCode
                    }] expected [${spec.expect}]`
                ];
                const headers = _.assign(
                    {},
                    baseHeaders,
                    _.mapKeys(spec.headers, (value, header) => header.toLowerCase())
                );
                _.forOwn(headers, (headerValueRegex, headerName) => {
                    const headerValue = response.headers[headerName];
                    if (!headerValue) {
                        summary.push(
                            `${options.method} [${options.uri}] missing header [${headerName}]`
                        );
                    } else if (!headerValue.match(new RegExp(headerValueRegex, 'i'))) {
                        summary.push(
                            `${options.method} [${
                                options.uri
                            }] header [${headerName}] invalid value [${headerValue}]`
                        );
                    } else {
                        summary.push(
                            `${options.method} [${
                                options.uri
                            }] header [${headerName}] valid value [${headerValue}]`
                        );
                    }
                });
                const resp = response.toJSON();
                if (!keepBody) {
                    delete resp.body;
                }
                return {
                    summary,
                    detail: resp
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
            headers: {
                'X-Content-Type-Options': 'nosniff',
                'strict-transport-security': 'max-age=\\d+; includeSubDomains'
            },
            paths: [
                {
                    path: '/',
                    method: 'GET',
                    keepBody: false,
                    headers: {
                        'Content-Security-policy': '.*',
                        'strict-transport-security': '.*'
                    },
                    expect: 200
                }
            ]
        };
    }
};
