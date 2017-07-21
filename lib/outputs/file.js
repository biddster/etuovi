const mkdirp = require('mkdirp');
const fs = require('fs');
const moment = require('moment');
const _ = require('lodash');

module.exports = {
    output(masterReport, config) {
        return new Promise((resolve, reject) => {
            const reportsDir = _.get(config, 'reportsDir', 'reports');
            mkdirp(reportsDir, (err) => {
                if (err) return reject(err);
                const file = `${reportsDir}/etuovi__scan__report__${moment(masterReport.startTime).format('YYYYMMDD__HHmmss')}.json`;
                fs.writeFile(file, JSON.stringify(masterReport, null, 4), 'utf8', (err1) => {
                    if (err) return reject(err);
                    resolve();
                });
                return file;
            });
        });
    },
    newConfig() {
        return {
            reportsDir: 'reports'
        };
    }
};