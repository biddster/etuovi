require('dotenv').config();
const assert = require('assert');
const helper = require('./helper');

describe('run as module', function() {
    this.timeout(30000);

    it('should fail in the correct manner when using module which fails', function() {
        const index = require('../index');
        index.logLevel('debug');
        helper.addScanner('fail', './fixtures/fail-scanner.js');
        helper.addOutput('devnull', './fixtures/devnull-output.js');
        return index.scan('test/fixtures/fail-scanner-config.json').then(masterReport => {
            assert(masterReport.errors.length);
            // TODO: assert the structure here
            assert.notStrictEqual(
                masterReport.errors[0].indexOf('failed in the fail plugin'),
                -1
            );
        });
    });
    it('should scan using success scanner config', function() {
        const index = require('../index');
        index.logLevel('warn');
        helper.addScanner('success', './fixtures/success-scanner.js');
        helper.addOutput('devnull', './fixtures/devnull-output.js');
        return index.scan('test/fixtures/success-scanner-config.json').then(masterReport => {
            assert.strictEqual(masterReport.errors.length, 0);
            assert.notEqual(Number(masterReport.startTime), NaN);
            assert(masterReport.hosts);
            // TODO: assert the structure here
            return masterReport;
        });
    });
});
