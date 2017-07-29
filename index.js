const l = require('winston');
l.cli();

const path = require('path');
const requireAll = require('require-all');

module.exports = requireAll(path.join(__dirname, 'cmds'));

module.exports.logLevel = (logLevel) => {
    l.level = logLevel;
};