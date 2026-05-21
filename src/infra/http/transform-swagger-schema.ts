import { jsonSchemaTransform } from 'fastify-type-provider-zod'

type TransformSwaggerSchemaData = Parameters<typeof jsonSchemaTransform>[0]

type SchemaBody = {
  type: string
  required: string[]
  properties: Record<string, unknown>
  [key: string]: unknown
}

export function transformSwaggerSchema(data: TransformSwaggerSchemaData) {
  const { schema, url } = jsonSchemaTransform(data)

  if (schema.consumes?.includes('multipart/form-data')) {
    const body: SchemaBody = (schema.body as SchemaBody) ?? {
      type: 'object',
      required: [],
      properties: {},
    }

    body.properties.file = {
      type: 'string',
      format: 'binary',
    }

    body.required.push('file')

    schema.body = body
  }

  return { schema, url }
}
