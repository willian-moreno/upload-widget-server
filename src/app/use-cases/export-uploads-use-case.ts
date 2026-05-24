import { ilike } from 'drizzle-orm'
import z from 'zod'
import { db, pg } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeRight } from '@/shared/either'

const exportUploadsInput = z.object({
  searchQuery: z.string().optional(),
})

export type ExportUploadsInput = z.input<typeof exportUploadsInput>

export type ExportUploadsOutput = {
  reportUrl: string
}

export async function exportUploadsUseCase(
  input: ExportUploadsInput
): Promise<Either<never, ExportUploadsOutput>> {
  const { searchQuery } = exportUploadsInput.parse(input)

  const { sql, params } = db
    .select({
      id: schema.uploads.id,
      name: schema.uploads.name,
      remoteKey: schema.uploads.remoteKey,
      remoteUrl: schema.uploads.remoteUrl,
      createdAt: schema.uploads.createdAt,
    })
    .from(schema.uploads)
    .where(
      searchQuery ? ilike(schema.uploads.name, `%${searchQuery}%`) : undefined
    )
    .toSQL()

  const cursor = pg.unsafe(sql, params as string[]).cursor(1)

  for await (const rows of cursor) {
    console.log(rows)
  }

  return makeRight({ reportUrl: '' })
}
