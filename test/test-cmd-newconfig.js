require('dotenv').config();

const helper = require('./helper');
const assert = require('assert');
const path = require('path');
const fs = require('final-fs');

describe('test cmds newconfig', function() {
    beforeEach(helper.ensureCleanTestSpecificTmpDir);

    it('should create a new json config file', function() {
        const newConfig = require('../cmds/newconfig');
        const cwd = process.cwd();
        process.chdir(this.test.tmpDir);
        return newConfig().then(file => {
            process.chdir(cwd);
            // TODO: check structure here, rather than just check it parses as json.
            return fs.readJSON(path.join(this.test.tmpDir, file));
        });
    });
});
