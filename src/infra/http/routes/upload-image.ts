import type { FastifyInstance } from 'fastify'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
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
          409: z.object({
            message: z.string().describe('Upload already exists'),
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

      console.log(uploadedFile)

      const upload = await db
        .insert(schema.uploads)
        .values({
          name: 'test.jpg',
          remoteKey: `test-${Date.now()}.jpg`,
          remoteUrl: 'http://test.com',
        })
        .returning({ id: schema.uploads.id })

      return await reply.status(201).send({ uploadId: upload[0].id })
    }
  )
}
