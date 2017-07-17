const l = require('winston');
const Promise = require('bluebird');
const _ = require('lodash');

module.exports = {
    output(masterReport, config) {
        return new Promise((resolve, reject) => {});
    },
    newConfig() {
        return {
            username: '',
            password: '',
            server: ''
        };
    }
};