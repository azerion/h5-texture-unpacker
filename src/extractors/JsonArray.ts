import { IImageMatrix } from '../IMatrix'

export function JsonArray(data: string): IImageMatrix[] | null {
    const atlasData: any = JSON.parse(data)
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
