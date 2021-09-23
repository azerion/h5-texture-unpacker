import { IImageMatrix } from '../IMatrix'

const xpath = require('xpath'),
    dom = require('@xmldom/xmldom').DOMParser

export function Xml(data: Buffer): IImageMatrix[] {
    const doc = new dom().parseFromString(data.toString())
    const nodes = xpath.select('//SubTexture', doc)
    const imageResult: IImageMatrix[] = []

    if (nodes.length > 0) {
        nodes.forEach((node: any) => {
            imageResult.push({
                name: node.getAttribute('name'),
                w: parseInt(node.getAttribute('width')),
                h: parseInt(node.getAttribute('height')),
                x: parseInt(node.getAttribute('x')),
                y: parseInt(node.getAttribute('y'))
            })
        })
    }

    return imageResult
}
