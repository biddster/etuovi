require('dotenv').config();

const assert = require('assert');
const statusCodes = require('../plugins/scanners/statuscodes');

describe('test scanner statuscodes', function() {
    this.timeout(5 * 60000);

    it('should scan statuscodes', function() {
        return statusCodes.scan('myspace.com', statusCodes.newConfig()).then(report => {
            assert.strictEqual(report.summary.length, 1);
            assert.strictEqual(report.detail.length, 1);
            console.log(report);
        });
    });
});
