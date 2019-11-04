import { OutputInfo } from 'sharp'

const Sharp = require('sharp')
const path = require('path')
const fs = require('fs')
const yargs = require('yargs')
const winston = require('winston')

let date = new Date().toISOString()
const logFormat = winston.format.printf(function(info: any) {
    return `${date}-${info.level}: ${JSON.stringify(info.message, null, 4)}\n`
})
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), logFormat)
        })
    ]
})
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
    .usage('Usage: $0 -j [jsonFile] -o [outputDir]')
    .option('imageFile', {
        alias: 'i',
        demandOption: false,
        default: '',
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
    .option('verbose', {
        alias: 'v',
        default: false,
        describe: 'Show log messages',
        type: 'boolean'
    })
    .help('h')
    .alias('h', 'help')
    .epilog('copyright Azerion 2019').argv

let imgUrl: string = path.join(argv.i)
const jsonUrl: string = path.join(argv.j)
const outputDir: string = path.join(argv.o, '/')
const json: IJSONAtlas = JSON.parse(fs.readFileSync(jsonUrl))

logger.level = argv.verbose === true ? 'info' : 'warn'

if (argv.i === '') {
    //Image path empty string, let's see if we can get the image from the json
    imgUrl = path.join(path.parse(jsonUrl).dir, json.meta.image)
}

if (!fs.existsSync(imgUrl)) {
    //Let's check if the image file is found
    logger.error('Could not find image at specified path!')
    process.exit(1)
}

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir)
}

json.frames.forEach((source: IFrame) => {
    if (source.frame.w === 0 || source.frame.h === 0) {
        logger.warn(`Unable to write file , ${source.filename}: Source width/height is 0`)

        return
    }
    Sharp(imgUrl)
        .extract({
            width: source.frame.w,
            height: source.frame.h,
            left: source.frame.x,
            top: source.frame.y
        })
        .toFile(path.join(outputDir, '/', source.filename + '.png'))
        .then((fileInfo: OutputInfo) => {
            logger.info(`File: ${source.filename} written`)
        })
        .catch((err: any) => {
            logger.info(`Unable to write file , ${source.filename}:, ${err}`)
        })
})
