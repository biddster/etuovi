require('dotenv').config();

const report = require('../etuovi__scan__report.json');

describe('test outputs slack', function() {
    it('should output a report to slack', function() {
        return require('../../lib/outputs/slack').output(report, {
            slackWebhook: process.env.SLACK_WEBHOOK
        });
    });
});
