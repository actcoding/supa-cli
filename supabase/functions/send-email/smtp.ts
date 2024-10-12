import { SMTPClient } from 'https://cdn.jsdelivr.net/gh/actcoding/denomailer@v1.6.1/mod.ts'
import env from './config.ts'

const smtp = new SMTPClient({
    connection: {
        hostname: env.SMTP_HOST,
        port: env.SMTP_PORT,
        tls: env.SMTP_TLS,
        auth: {
            username: env.SMTP_USER,
            password: env.SMTP_PASSWORD,
        },
    },
})

export default smtp
