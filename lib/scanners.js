const scanners = {
    port: require('./scanners/port'),
    ssllabs: require('./scanners/ssllabs')
}

module.exports = {
    load() {
        // TODO - discover the scanners on the fly
    },
    locate(scanner) {
        return scanners[scanner];
    }
};