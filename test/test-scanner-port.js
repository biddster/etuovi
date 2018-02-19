require('dotenv').config();

const assert = require('assert');
const port = require('../plugins/scanners/port');

describe('test scanner nmap', function() {
    this.timeout(5 * 60000);

    it('should scan ports', function() {
        return port.scan('myspace.com', port.newConfig()).then(report => {
            assert.strictEqual(report.summary.length, 1);
            assert.strictEqual(report.detail.length, 5);
            console.log(report);
        });
    });
});
