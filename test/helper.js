const path = require('path');
const fs = require('final-fs');

const tmpDir = path.join(process.cwd(), '.tmp');

module.exports = {
    tmpDir,
    ensureCleanTmpDir() {
        return fs
            .exists(tmpDir)
            .then(exists => (exists ? fs.rmdirRecursive(tmpDir) : null))
            .then(() => {
                return fs.mkdirRecursive(tmpDir);
            });
    }
};
