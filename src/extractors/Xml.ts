import { IImageMatrix } from '../IMatrix'

const xml2js = require('xml2js')
const parser = new xml2js.Parser()

export function Xml(data: string): IImageMatrix[] | null {
    let atlasData: any | null = null

    parser.parseString(data, function(err: any, result: any) {
        console.dir(result)
        console.log('Done')
    })

    process.exit(0)

    const imageResult: IImageMatrix[] = []

    if (atlasData.hasOwnProperty('frames') && Array.isArray(atlasData.frames)) {
        atlasData.frames.forEach((imageData: any) => {
            imageResult.push({
                name: imageData.filename,
                w: imageData.frame.w,
                h: imageData.frame.h,
                x: imageData.frame.x,
                y: imageData.frame.y
            })
        })

        return imageResult
    }
    return null
}
