import { Readable } from 'node:stream'
import z from 'zod'
import { InvalidFileFormat } from '@/app/errors/invalid-file-format'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/shared/either'

const uploadImageInput = z.object({
  fileName: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable),
})

export type UploadImageInput = z.input<typeof uploadImageInput>

const allowedMimeTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp']

export async function uploadImageUseCase(
  input: UploadImageInput
): Promise<Either<InvalidFileFormat, { uploadId: string }>> {
  const { fileName, contentType } = uploadImageInput.parse(input)

  if (!allowedMimeTypes.includes(contentType)) {
    return makeLeft(new InvalidFileFormat())
  }

  const upload = await db
    .insert(schema.uploads)
    .values({
      name: fileName,
      remoteKey: fileName,
      remoteUrl: fileName,
    })
    .returning({ id: schema.uploads.id })

  return makeRight({
    uploadId: upload[0].id,
  })
}
