const path = require('path');
const fs = require('final-fs');

const tmpDir = path.join(process.cwd(), 'test/.tmp');

module.exports = {
    ensureCleanTestSpecificTmpDir() {
        const testTmpDir = path.join(tmpDir, this.currentTest.title);
        this.currentTest.tmpDir = testTmpDir;
        return fs
            .exists(testTmpDir)
            .then(exists => (exists ? fs.rmdirRecursive(testTmpDir) : null))
            .then(() => {
                return fs.mkdirRecursive(testTmpDir).then(() => {
                    return testTmpDir;
                });
            });
    }
};
