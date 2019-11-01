#!/usr/bin/env node

import { OutputInfo } from 'sharp'

const Sharp = require('sharp')
const path = require('path')
const fs = require('fs')
const yargs = require('yargs')

const basePath = path.join(__dirname, '../')

declare interface IMatrix {
    x: number
    y: number
    w: number
    h: number
}

declare interface ISizePoint {
    w: number
    h: number
}

declare interface IFrame {
    filename: string
    frame: IMatrix
    rotated: boolean
    trimmed: boolean
    spriteSourceSize: IMatrix
    sourceSize: ISizePoint
}

declare interface IJSONAtlas {
    frames: IFrame[]
    meta: {
        app: string
        version: string
        image: string
        format: string
        size: ISizePoint
        scale: number
    }
}

const argv = yargs
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
    .epilog('copyright Azerion 2019').argv

const imgUrl: string = path.join(argv.i)
const jsonUrl: string = path.join(argv.j)
const outputDir: string = path.join(argv.o, '/')
const json: IJSONAtlas = JSON.parse(fs.readFileSync(jsonUrl))

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir)
}

json.frames.forEach((source: IFrame) => {
    Sharp(imgUrl)
        .extract({
            width: source.frame.w,
            height: source.frame.h,
            left: source.frame.x,
            top: source.frame.y
        })
        .toFile(path.join(outputDir, '/', source.filename + '.png'))
        .then((fileInfo: OutputInfo) => {
            console.log('File: ', source.filename, ' written')
        })
        .catch((err: any) => {
            console.log('Unable to write file ', source.filename, ':', err)
        })
})
