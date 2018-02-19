require('dotenv').config();

const headers = require('../plugins/scanners/headers');

describe('test scanner headers', function() {
    this.timeout(30000);

    it('should scan for headers', function() {
        return headers.scan('myspace.com', headers.newConfig()).then(report => {
            console.log(report);
        });
    });
});
