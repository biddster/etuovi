const toCamelCase = require(`change-case`).camel

module.exports = (osmosis, url, followRedirects = true, results = []) =>
    new Promise((resolve, reject) => {
        osmosis(
                `https://securityheaders.io/`, {
                    q: url,
                    followRedirects: `on`,
                    hide: 'on'
                }
            )
            .config(`user_agent`, `https://www.npmjs.com/package/security-headers`)
            .find(`.reportSection`)
            .set(`section`, `.reportTitle`)
            .select(`.reportTable tr`)
            .set({
                key: `.tableLabel`,
                value: `.tableCell`
            })
            .data(data => results.push(data))
            .done(() => resolve(
                results.reduce((all, data) => {
                    const section = toCamelCase(data.section)
                    const key = (
                        [data.key]
                        .map(key =>
                            key[key.length - 1] === `:` ?
                            key.slice(0, key.length - 1) :
                            key
                        )
                    )
                    const value = data.value

                    return {
                        ...all,
                        [section]: {
                            ...(all.hasOwnProperty(section) ? all[section] : {}),
                            [section === `securityReportSummary` ? toCamelCase(key) : key]: value
                        }
                    }
                }, {})
            ))
            .error(error => reject(error))
    })