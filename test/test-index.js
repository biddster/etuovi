require('dotenv').config();
const assert = require('assert');

describe('run as module', function() {
    this.timeout(60000);
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
