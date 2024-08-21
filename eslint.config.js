import { configActDefault } from '@actcoding/eslint-config'

/** @type import('eslint').Linter.Config[] */
const config = [
    ...configActDefault,
    {
        name: 'supa-cli/ignores',
        ignores: [
            '*.d.ts',
            'supabase/',
            '.venv',
            '.cache/',
        ],
    },
]

export default config
