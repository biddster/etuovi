require('dotenv').config();

const assert = require('assert');
const headers = require('../plugins/scanners/headers');

describe('test scanner headers', function() {
    this.timeout(30000);

    it('should scan headers', function() {
        return headers.scan('myspace.com', headers.newConfig()).then(report => {
            assert.strictEqual(report.summary.length, 4);
            assert.strictEqual(report.detail.length, 1);
            console.log(report);
        });
    });
});
