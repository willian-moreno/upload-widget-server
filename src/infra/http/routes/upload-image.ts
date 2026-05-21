import type { FastifyInstance } from 'fastify'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { uploadImageUseCase } from '@/app/use-cases/upload-image-use-case'
import { isLeft, unwrapEither } from '@/shared/either'

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
          201: z.null().describe('Image uploaded'),
          400: z.object({ message: z.string() }),
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
        return reply.status(400).send({ message: 'File is required' })
      }

      const result = await uploadImageUseCase({
        fileName: uploadedFile.filename,
        contentType: uploadedFile.mimetype,
        contentStream: uploadedFile.file,
      })

      if (isLeft(result)) {
        const error = unwrapEither(result)

        switch (error.name) {
          case 'InvalidFileFormat': {
            return reply.status(400).send({ message: error.message })
          }
        }

        return
      }

      return reply.status(201).send()
    }
  )
}
