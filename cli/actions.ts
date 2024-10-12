import type { InstallerModule } from '@/types.js'

const actions: InstallerModule[] = [
    await import('@/actions/status.js'),
    await import('@/actions/list.js'),
    await import('@/actions/storage/upload.js'),
    await import('@/actions/config/print.js'),
    await import('@/actions/config/generate.js'),
    await import('@/actions/email/configure.js'),
    await import('@/actions/email/compile.js'),
    await import('@/actions/migrate/status.js'),
    await import('@/actions/migrate/rollback.js'),
    await import('@/actions/migrate/redo.js'),
    await import('@/actions/migrate/index.js'),
    await import('@/actions/migrate/fresh.js'),
    await import('@/actions/make/migrations.js'),
    await import('@/actions/db/typegen.js'),
    await import('@/actions/db/seed.js'),
    await import('@/actions/db/reset.js'),
    await import('@/actions/auth/jwt.js')
]

export default actions
