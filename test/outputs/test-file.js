require('dotenv').config();

const helper = require('../helper');
const assert = require('assert');

const report = require('../etuovi__scan__report.json');

describe('test outputs file', function() {
    beforeEach(helper.ensureCleanTestSpecificTmpDir);

    it('should output a json file', function() {
        report.startTime = 0;
        return require('../../plugins/outputs/file')
            .output(report, {
                reportsDir: this.test.tmpDir
            })
            .then(file => {
                const written = require(file);
                assert.deepStrictEqual(written, report);
            });
    });
});
