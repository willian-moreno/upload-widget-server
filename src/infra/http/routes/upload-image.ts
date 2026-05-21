import type { FastifyInstance } from 'fastify'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { uploadImageUseCase } from '@/app/use-cases/upload-image-use-case'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'

export const uploadImageRoute: FastifyPluginAsyncZod = async (
  server: FastifyInstance
) => {
  server.post(
    '/uploads',
    {
      schema: {
        summary: 'Upload an image',
        consumes: ['multipart/form-data'],
        response: {
          201: z.object({ uploadId: z.string() }),
          400: z.object({
            message: z.string().describe('File is required'),
          }),
        },
      },
    },
    async (request, reply) => {
      const uploadedFile = await request.file({
        limits: {
          fileSize: 5 * 1024 * 1024, // 5MB
        },
      })

      if (!uploadedFile) {
        return await reply.status(400).send({ message: 'File is required' })
      }

      const { uploadId } = await uploadImageUseCase({
        fileName: uploadedFile.filename,
        contentType: uploadedFile.mimetype,
        contentStream: uploadedFile.file,
      })

      return await reply.status(201).send({ uploadId })
    }
  )
}
