export type EmailAction =
    | 'signup'
    | 'recovery'
    | 'invite'
    | 'magic_link'
    | 'email_change'
    | 'email_change_new'
    | 'reauthentication'

export type EmailPayload = {
    user:
    | {
        is_anonymous: true
    }
    | {
        id: string
        aud: 'authenticated'
        role: 'anon' | 'authenticated'
        email: string
        phone: string
        app_metadata: {
            provider?: 'email'
            providers?: ['email']
        }
        user_metadata: {
            email?: string
            email_verified?: boolean
            phone_verified?: boolean
            sub?: string
            [k: string]: any
        }
        identities: {
            identity_id: string
            id: string
            user_id: string
            identity_data: {
                email?: string
                email_verified?: boolean
                phone_verified?: boolean
                sub?: string
            }
            provider: 'email'
            last_sign_in_at: string
            created_at: string
            updated_at: string
            email: string
        }[]
        created_at: string
        updated_at: string
        is_anonymous: false
    }

    email_data: {
        token: string
        token_hash: string
        redirect_to: string
        email_action_type: EmailAction
        site_url: string
        token_new: string
        token_hash_new: string
    }
}
