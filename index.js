#!/usr/bin/env node

var exampleTxt = 'Add copyright';
var chalk = require('chalk');
var argv = require('yargs')
    .option('f', {
        alias: 'files',
        demand: true,
        array: true,
        describe: 'files or glob/wildcard to be matched and concatenated',
        type: 'string'
    })
    .usage('$0 concatinator -f string')
    .example('concatinator -f *.php', exampleTxt)
    .help('help')
    .argv;

    
var glob = require("glob");
var fs = require("fs");
var loop = require("serial-loop");

var errorHandler = function (error) {
    if(error) {
        console.log(chalk.red(error));
        process.exit()
    }
}

if(!Array.isArray(argv.f)) {
    errorHandler('Files should be an Array'); 
}

var destination = argv.o === 'all' ?  argv.o + '.' + argv.f[0].substr((~-argv.f[0].lastIndexOf(".") >>> 0) + 2) : argv.o;

fs.writeFile(destination, '', function (error) {
    if (error) {
        errorHandler(error); 
    }

    argv.f.forEach(function (input) {
        glob(input, function (er, files) {
            loop(files.length, each, errorHandler);
            function each (done, i) {
                fs.readFile(files[i], function (error, buffer) {
                    if (error) {
                        return done(error);
                    }
                    fs.appendFile(destination, buffer, done);
                });
            }
        })
    });
    
    console.log(chalk.green('Files concatenated!'));
})
