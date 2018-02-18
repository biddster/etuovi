const fs = require('final-fs');
const moment = require('moment');
const _ = require('lodash');

module.exports = {
    output(masterReport, config) {
        const reportsDir = _.get(config, 'reportsDir', 'reports');
        const file = `${reportsDir}/etuovi__scan__report__${moment(
            masterReport.startTime
        ).format('YYYYMMDD__HHmmss')}.json`;

        return fs.mkdirRecursive(reportsDir).then(() => {
            return fs.writeJSON(file, masterReport).then(() => file);
        });
    },
    newConfig() {
        return {
            reportsDir: 'reports'
        };
    }
};
