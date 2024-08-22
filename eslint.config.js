import { configActDefault } from '@actcoding/eslint-config'

/** @type import('eslint').Linter.Config[] */
const config = [
    ...configActDefault,
    {
        ignores: [
            '*.d.ts',
            'supabase/functions',
            '.venv',
        ],
    },
]

export default config
