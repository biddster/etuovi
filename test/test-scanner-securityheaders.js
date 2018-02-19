require('dotenv').config();

const assert = require('assert');
const securityHeaders = require('../plugins/scanners/securityheaders');

describe('test scanner securityheaders', function() {
    this.timeout(30000);

    it('should get a report from securityheaders.io', function() {
        return securityHeaders.scan('myspace.com', securityHeaders.newConfig()).then(report => {
            assert.strictEqual(report.summary.length, 1);
            assert.strictEqual(report.detail.length, 1);
            console.log(report);
        });
    });
});
