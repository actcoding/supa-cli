import type { InstallerModule } from './types'

const actions: InstallerModule[] = [
    await import('./actions/status.ts'),
    await import('./actions/list.ts'),
    await import('./actions/auth/jwt.ts'),
    await import('./actions/migrate/rollback.ts'),
    await import('./actions/migrate/status.ts'),
    await import('./actions/migrate/index.ts'),
    await import('./actions/migrate/redo.ts'),
    await import('./actions/migrate/fresh.ts'),
    await import('./actions/make/migrations.ts'),
    await import('./actions/config/print.ts'),
    await import('./actions/config/generate.ts'),
    await import('./actions/db/seed.ts'),
    await import('./actions/db/typegen.ts'),
    await import('./actions/db/reset.ts'),
    await import('./actions/email/compile.ts'),
    await import('./actions/email/configure.ts')
]

export default actions
