import * as base64 from "jsr:@std/encoding/base64"
import { join } from 'jsr:@std/path@^1.0'
import type { Root } from 'npm:@types/hast@3.0.4'
import { selectAll } from 'npm:hast-util-select@6.0.2'
import { CompilerConfig } from './index.ts'

type Props = {
    config: CompilerConfig
}

export default function inlineImages({ config }: Props) {
    return async function (rootNode: Root) {
        const imgElements = selectAll('img', rootNode)
        for await (const image of imgElements) {
            const imgPath = image.properties.src as string
            if (imgPath?.startsWith('data:')) {
                // ignore image that's already inlined
                return
            }

            const isSupabase = imgPath.startsWith('supabase://')
            const fileExt = imgPath?.match('\\.([a-zA-Z]+)$')?.[1]
            if (fileExt === undefined || fileExt === null) {
                throw new Error('image path without file extension')
            }

            const imgContent = await doReadFile(imgPath, isSupabase ? config : undefined)
            if (fileExt === 'svg') {
                image.properties.src = `data:image/svg+xml;base64,${imgContent}`
            } else {
                image.properties.src = `data:image/${fileExt};base64,${imgContent}`
            }
        }
    }
}

async function doReadFile(path: string, config?: CompilerConfig) {
    if (config === undefined) {
        const response = await fetch(path, {
            method: 'GET',
            cache: 'no-store',
        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        const buffer = await response.arrayBuffer()
        return base64.encodeBase64(buffer)
    }

    const { supabase, bucket } = config
    const { error, data } = await supabase.storage.from(bucket).download(join('assets', path.substring(11)))
    if (error) {
        throw error
    }

    const buffer = await data.arrayBuffer()
    return base64.encodeBase64(buffer)
}
