import { OutputInfo } from 'sharp'
import { AssetType } from './AtlasType'
import { IImageMatrix } from './IMatrix'
import { JsonArray, JsonHash, Xml } from './extractors'

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

const argv = yargs
    .usage('Usage: $0 -j [jsonFile] -o [outputDir]')
    .option('imageFile', {
        alias: 'i',
        demandOption: true,
        default: '',
        describe: 'The input texture image',
        type: 'string'
    })
    .option('atlasFile', {
        alias: 'a',
        demandOption: true,
        describe: 'The input atlas',
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
    .epilog('copyright Azerion 2021').argv

let imgPath: string = path.join(argv.i)
const atlasPath: string = path.join(argv.a)
const outputDir: string = path.join(argv.o, '/')
const rawData: Buffer = fs.readFileSync(atlasPath)
let imageMatrixData: IImageMatrix[] = []

logger.level = argv.verbose === true ? 'info' : 'warn'

if (!fs.existsSync(imgPath)) {
    //Let's check if the image file is found
    logger.error('Could not find image at specified path!')
    process.exit(1)
}

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir)
}

if (atlasPath.match(/\.json$/)) {
    //It's a json file!
    imageMatrixData = JsonArray(rawData)

    if (null === imageMatrixData) {
        imageMatrixData = JsonHash(rawData)
    }

    if (null === imageMatrixData) {
        logger.error(`Could not get Hash nor Array data from json file: ${atlasPath}`)
        process.exit(1)
    }
} else if (atlasPath.match(/\.xml$/)) {
    //It's an xml file!
    imageMatrixData = Xml(rawData)
} else {
    logger.error(`Unknown file format: ${atlasPath}`)
    process.exit(1)
}

let count: number = 0

if (imageMatrixData.length === 0) {
    logger.error(`No data found: ${atlasPath}`)
    process.exit(1)
}

imageMatrixData.forEach((source: IImageMatrix) => {
    if (source.w === 0 || source.h === 0) {
        logger.warn(`Unable to write file , ${source.name}: Source width/height is 0`)
        return
    }

    Sharp(imgPath)
        .extract({
            width: source.w,
            height: source.h,
            left: source.x,
            top: source.y
        })
        .toFile(path.join(outputDir, '/', source.name + '.png'))
        .then((fileInfo: OutputInfo) => {
            logger.info(`File: ${source.name} written`)
            count++
        })
        .catch((err: any) => {
            logger.info(`Unable to write file , ${source.name}:, ${err}`)
        })
})

console.log(`Done writing ${count} images to ${outputDir}`)
