const Promise = require('bluebird');

module.exports = {
    output() {
        return Promise.resolve();
    },
    newConfig() {
        return {};
    }
};
