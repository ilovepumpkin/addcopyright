#!/usr/bin/env node

var exampleTxt = 'Add copyright';
var chalk = require('chalk');
var argv = require('yargs')
    .option('f', {
        alias: 'files',
        demand: true,
        array: true,
        describe: 'files or glob/wildcard to be added copyright',
        type: 'string'
    })
    .option('c', {
        alias: 'copyright',
        demand: true,
        describe: 'file contains copyright',
        type: 'string'
    })
    .usage('$0 concatinator -f string -c string')
    .example('concatinator -f *.php -c copyright.txt', exampleTxt)
    .help('help')
    .argv;


var glob = require("glob");
var fs = require("fs");
var loop = require("serial-loop");

var errorHandler = function(error) {
    if (error) {
        console.log(chalk.red(error));
        process.exit()
    }
}

if (!Array.isArray(argv.f)) {
    errorHandler('Files should be an Array');
}

fs.readFile(argv.c, function(error, copyright) {
    if (error) {
        return errorHandler(error);
    }

    argv.f.forEach(function(input) {
        glob(input, function(er, files) {
            files.forEach(targetFile => {
                if (fs.lstatSync(targetFile).isFile()) {
                    fs.readFile(targetFile, function(error, buffer) {
                        if (error) {
                            return errorHandler(error);
                        }
                        if (buffer.indexOf(copyright) === -1) {
                            console.log(chalk.green(targetFile));
                            fs.writeFile(targetFile, copyright + buffer, errorHandler)
                        } else {
                            console.log(chalk.yellow(targetFile));
                        }
                    });
                }
            })

            // loop(files.length, each, errorHandler);

            // function each(done, i) {
            //     if (fs.lstatSync(files[i]).isFile()) {
            //         fs.readFile(files[i], function(error, buffer) {
            //             if (error) {
            //                 return done(error);
            //             }
            //             if (buffer.indexOf(copyright) === -1) {
            //                 console.log(chalk.green(files[i]));
            //                 fs.writeFile(files[i], copyright + buffer, done)
            //             } else {
            //                 console.log(chalk.yellow(files[i]));
            //             }
            //         });
            //     }
            // }
        })
    });
});