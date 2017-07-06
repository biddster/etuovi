const l = require('winston');
l.cli();

require('yargs')
    .option('log-level', {
        demandOption: false,
        default: 'info',
        describe: 'one of [error, warn, info, debug, verbose, silly]',
        type: 'string',
        coerce: (logLevel) => {
            l.level = logLevel;
            return logLevel;
        }
    })
    .commandDir('cmds')
    .demandCommand(1, 1)
    .help()
    .argv;