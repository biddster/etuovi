const headers = require(`security-headers`);
module.exports = {
    scan(host, config) {
        // return request(host);
        return headers(host);
    }
}