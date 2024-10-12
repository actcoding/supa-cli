// @deno-types="npm:@types/mjml@4.7.4"
import mjml2html from 'npm:mjml@4.15.3'

// @deno-types="npm:@types/ejs@3.1.5"
import ejs from 'npm:ejs@3.1.10'

type Props = {
    source: string
    data: Record<string, unknown>
}

export async function compile({ source, data }: Props) {
    const template = ejs.compile(source, {
        async: true,
        beautify: false,
        cache: false,
        strict: true,
    })

    const mjml = await template(data)
    const { errors, html } = mjml2html(mjml, {
        filePath: Deno.cwd()
    })

    if (errors.length > 0) {
        return errors
    }

    return html
}
