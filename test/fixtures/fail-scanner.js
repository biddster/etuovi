const Promise = require('bluebird');

module.exports = {
    scan() {
        return Promise.reject(new Error('failed in the fail plugin'));
    }
};
