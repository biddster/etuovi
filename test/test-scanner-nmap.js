require('dotenv').config();

const assert = require('assert');
const nmap = require('../plugins/scanners/nmap');

describe('test scanner nmap', function() {
    this.timeout(5 * 60000);

    it('should scan nmap', function() {
        return nmap.scan('myspace.com', nmap.newConfig()).then(report => {
            assert.strictEqual(report.summary.length, 1);
            assert.strictEqual(report.detail.length, 5);
            console.log(report);
        });
    });
});
