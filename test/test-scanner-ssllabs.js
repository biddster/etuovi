require('dotenv').config();

const assert = require('assert');
const ssllabs = require('../plugins/scanners/ssllabs');

describe('test scanner ssllabs', function() {
    this.timeout(5 * 60000);

    it('should get a report from ssllabs', function() {
        return ssllabs.scan('myspace.com', ssllabs.newConfig()).then(report => {
            assert.strictEqual(report.summary.length, 1);
            assert.strictEqual(report.summary[0].indexOf('Grade [C]'), 0);
            assert.strictEqual(report.detail.length, 1);
            console.log(report);
        });
    });
});
