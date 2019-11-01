#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Sharp = require('sharp');
var path = require('path');
var fs = require('fs');
var yargs = require('yargs');
var basePath = path.join(__dirname, '../');
var argv = yargs
    .usage('Usage: $0 [imageFile] [jsonFile] [outputDir]')
    .option('imageFile', {
    alias: 'i',
    demandOption: true,
    describe: 'The input texture image',
    type: 'string'
})
    .option('jsonFile', {
    alias: 'j',
    demandOption: true,
    describe: 'The input JSON configuration',
    type: 'string'
})
    .option('outputDir', {
    alias: 'o',
    demandOption: true,
    describe: 'The output folder',
    type: 'string'
})
    .help('h')
    .alias('h', 'help')
    .epilog('copyright Azerion 2019')
    .argv;
var imgUrl = path.join(argv.i);
var jsonUrl = path.join(argv.j);
var outputDir = path.join(argv.o, '/');
var json = JSON.parse(fs.readFileSync(jsonUrl));
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}
json.frames.forEach(function (source) {
    Sharp(imgUrl).extract({
        width: source.frame.w,
        height: source.frame.h,
        left: source.frame.x,
        top: source.frame.y
    }).toFile(path.join(outputDir, '/', source.filename + '.png')).then(function (fileInfo) {
        console.log('File: ', source.filename, ' written');
    }).catch(function (err) {
        console.log('Unable to write file ', source.filename, ':', err);
    });
});
