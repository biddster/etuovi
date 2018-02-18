require('dotenv').config();
const assert = require('assert');

describe('run as module', function() {
    this.timeout(60000);

    it('should fail in the correct manner when using module which fails', function() {
        const index = require('../index');
        index.logLevel('debug');
        const plugins = require('../plugins');
        plugins.load();
        plugins.addScanner('fail', require('./fixtures/failing-plugin.js'));
        return index.scan('test/fixtures/failing-plugin-config.json').then(masterReport => {
            assert(masterReport.errors.length);
            assert.notStrictEqual(
                masterReport.errors[0].indexOf('failed in the fail plugin'),
                -1
            );
        });
    });
    it('should scan using example config', function() {
        const index = require('../index');
        index.logLevel('warn');
        return index.scan('example-config.json').then(masterReport => {
            assert.strictEqual(masterReport.errors.length, 0);
            assert.notEqual(Number(masterReport.startTime), NaN);
            assert(masterReport.hosts);
            return masterReport;
        });
    });
});
