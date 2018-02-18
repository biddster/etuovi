const Promise = require('bluebird');

module.exports = {
    scan() {
        return Promise.resolve({
            summary: ['mock summary'],
            detail: ['mock detail']
        });
    }
};
