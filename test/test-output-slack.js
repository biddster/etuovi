require('dotenv').config();

const report = require('./fixtures/etuovi__scan__report.json');

describe('test outputs slack', function() {
    this.timeout(30000);

    it('should output a report to slack', function() {
        return require('../plugins/outputs/slack').output(report, {
            slackWebhook: process.env.SLACK_WEBHOOK
        });
    });
});
