import { IImageMatrix } from '../IMatrix'

export function JsonHash(data: Buffer): IImageMatrix[] {
    const atlasData: any = JSON.parse(data.toString())
    const imageResult: IImageMatrix[] = []

    if (atlasData.hasOwnProperty('frames') && !Array.isArray(atlasData.frames)) {
        const keys = Object.keys(atlasData.frames)

        keys.forEach((filename: string) => {
            let imageData: any = atlasData.frames[filename]
            imageResult.push({
                name: filename,
                w: imageData.frame.w,
                h: imageData.frame.h,
                x: imageData.frame.x,
                y: imageData.frame.y
            })
        })
    }
    return imageResult
}
