import { SupabaseClient } from 'jsr:@supabase/supabase-js@2'
import { MJMLParseError } from 'npm:mjml-core@4.15.3'
import { compile } from './compiler.ts'
import { EmailPayload } from './types.ts'
import { rehype } from 'npm:rehype@13.0.1'
import rehypeMinify from 'npm:rehype-preset-minify@7.0.0'
import rehypeStringify from 'npm:rehype-stringify@10.0.0'
import inlineImages from './inline-images.ts';

export type CompilerConfig = {
    supabase: SupabaseClient
    bucket: string
    payload: EmailPayload
}

type Result =
    | {
        data: string
        errors: null
    }
    | {
        data: null
        errors: MJMLParseError[]
    }

export default async function compileEmail(config: CompilerConfig): Promise<Result> {
    const { supabase, bucket, payload } = config
    const { error, data } = await supabase.storage.from(bucket).download(`templates/${payload.email_data.email_action_type}.mjml`)
    if (error) {
        throw error
    }

    const result = await compile({
        source: await data.text(),
        data: payload.email_data,
    })

    if (typeof result === 'string') {
        const processed = await rehype()
            .use(inlineImages(config))
            .use(rehypeMinify)
            .use(rehypeStringify)
            .process(result)
        return {
            data: String(processed),
            errors: null,
        }
    }

    return {
        errors: result,
        data: null,
    }
}
