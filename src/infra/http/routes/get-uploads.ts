import type { FastifyInstance } from 'fastify'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { getUploadsUseCase } from '@/app/use-cases/get-uploads-use-case'
import { unwrapEither } from '@/shared/either'

const getUploadsQuery = z.object({
  searchQuery: z.string().optional(),
  sortBy: z.enum(['createdAt']).optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().optional().default(1),
  pageSize: z.coerce.number().optional().default(20),
})

type GetUploadsQuery = z.infer<typeof getUploadsQuery>

export const getUploadsRoute: FastifyPluginAsyncZod = async (
  server: FastifyInstance
) => {
  server.get(
    '/uploads',
    {
      schema: {
        summary: 'Get uploads',
        tags: ['uploads'],
        querystring: getUploadsQuery,
        response: {
          200: z.object({
            uploads: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                remoteKey: z.string(),
                remoteUrl: z.string(),
                createdAt: z.date(),
              })
            ),
            total: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { searchQuery, sortBy, sortDirection, page, pageSize } =
        request.query as GetUploadsQuery

      const result = await getUploadsUseCase({
        searchQuery,
        sortBy,
        sortDirection,
        page,
        pageSize,
      })

      const { uploads, total } = unwrapEither(result)

      return reply.status(200).send({ uploads, total })
    }
  )
}
