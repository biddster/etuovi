const l = require('winston');
const rp = require('request-promise');
const _ = require('lodash');

module.exports = {
    output(masterReport, config) {
        const message = _.map(masterReport.hosts, host => {
            return {
                title: host.host,
                fields: _.map(host.scanners, (scannerReport, scannerName) => {
                    return {
                        title: scannerName,
                        value: scannerReport.summary.join('\n'),
                        short: false
                    };
                })
            };
        });
        l.verbose(message);
        return rp({
            url: config.slackWebhook,
            method: 'POST',
            json: true,
            body: {
                text: `Etuovi scan - ${new Date(masterReport.startTime).toISOString()}`,
                attachments: message
            }
        }).then(response => {
            l.info('Wrote report to slack');
            return response;
        });
    },
    newConfig() {
        return {
            slackWebhook: ''
        };
    }
};
