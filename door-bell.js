require('yargs')
    .commandDir('cmds')
    .demandCommand()
    .help()
    .argv;