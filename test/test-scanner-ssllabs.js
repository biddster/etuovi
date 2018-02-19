require('dotenv').config();

const ssllabs = require('../plugins/scanners/ssllabs');

describe('test scanner ssllabs', function() {
    this.timeout(5 * 60000);

    it('should scan ssllabs', function() {
        return ssllabs.scan('myspace.com', ssllabs.newConfig()).then(report => {
            console.log(report);
        });
    });
});
