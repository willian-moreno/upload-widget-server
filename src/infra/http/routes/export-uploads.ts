import type { FastifyInstance } from 'fastify'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { exportUploadsUseCase } from '@/app/use-cases/export-uploads-use-case'
import { unwrapEither } from '@/shared/either'

const exportUploadsQuery = z.object({
  searchQuery: z.string().optional(),
})

type ExportUploadsQuery = z.infer<typeof exportUploadsQuery>

export const exportUploadsRoute: FastifyPluginAsyncZod = async (
  server: FastifyInstance
) => {
  server.post(
    '/uploads/exports',
    {
      schema: {
        summary: 'Export uploads',
        tags: ['uploads'],
        querystring: exportUploadsQuery,
        response: {
          200: z.object({
            reportUrl: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { searchQuery } = request.query as ExportUploadsQuery

      const result = await exportUploadsUseCase({
        searchQuery,
      })

      const { reportUrl } = unwrapEither(result)

      return reply.status(200).send({ reportUrl })
    }
  )
}
