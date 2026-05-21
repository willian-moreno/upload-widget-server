import type { Config } from 'drizzle-kit'
import { env } from '@/env'

export default {
  dialect: 'postgresql',
  schema: 'src/infra/db/schemas/*',
  out: 'src/infra/db/migrations',
  verbose: true,
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config
