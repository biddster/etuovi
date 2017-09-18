const l = require('winston');
const Promise = require('bluebird');
const _ = require('lodash');
const path = require('path');
const exec = require('child_process').exec;

module.exports = {
    output(masterReport, config) {
        return Promise.try(() => {
            const subject = 'WIP';
            exec(
                `mutt -e "set content_type=text/html" -s "${subject}" "${config.to}" < ${bodyFile}`,
                (error, stdout, stderr) => {
                    if (error) throw error;
                    return stdout;
                }
            );
        });
    },
    newConfig() {
        return {
            to: ''
        };
    }
};
