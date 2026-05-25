# upload-widget-server

> Servidor backend para upload de arquivos — API REST construída com Fastify, Drizzle ORM, PostgreSQL e Cloudflare R2.

---

## Sumário

- [upload-widget-server](#upload-widget-server)
  - [Sumário](#sumário)
  - [Visão Geral](#visão-geral)
  - [Stack Tecnológica](#stack-tecnológica)
  - [Pré-requisitos](#pré-requisitos)
  - [Como Começar](#como-começar)
  - [Variáveis de Ambiente](#variáveis-de-ambiente)
  - [Docker](#docker)
  - [Scripts](#scripts)
  - [Banco de Dados](#banco-de-dados)
  - [Documentação da API](#documentação-da-api)
  - [Testes](#testes)
  - [Autor](#autor)
  - [Licença](#licença)

---

## Visão Geral

`upload-widget-server` é o serviço backend responsável por receber uploads de arquivos, armazená-los no Cloudflare R2 e persistir os metadados em um banco de dados PostgreSQL. Ele expõe uma API RESTful consumida pelo frontend do widget de upload.

**Principais funcionalidades:**

- Upload de arquivos multipart via `@fastify/multipart`
- Armazenamento no Cloudflare R2 usando `@aws-sdk/client-s3` e `@aws-sdk/lib-storage` (API compatível com S3)
- Persistência relacional com Drizzle ORM + PostgreSQL (driver `postgres`)
- Validação de esquemas com Zod + `fastify-type-provider-zod`
- Documentação OpenAPI gerada automaticamente via `@fastify/swagger` + `@fastify/swagger-ui`
- Exportação de CSV com `csv-stringify`
- Suporte a CORS via `@fastify/cors`
- UUIDv7 para identificadores únicos ordenáveis por tempo

---

## Stack Tecnológica

| Camada         | Tecnologia                            |
| -------------- | ------------------------------------- |
| Runtime        | Node.js 22 (ESM, `"type": "module"`)  |
| Linguagem      | TypeScript 6                          |
| Framework      | Fastify 5                             |
| ORM            | Drizzle ORM + drizzle-kit             |
| Banco de dados | PostgreSQL                            |
| Armazenamento  | Cloudflare R2 (API compatível com S3) |
| Validação      | Zod 4                                 |
| Linter         | Biome 2                               |
| Testes         | Vitest 4                              |
| Servidor dev   | tsx (modo watch)                      |

---

## Pré-requisitos

- **Node.js** >= 22 (suporte a ESM obrigatório)
- **PostgreSQL** >= 14 (instância local, remota ou via Docker)
- **Conta Cloudflare** com um bucket R2 e credenciais de acesso
- **npm** >= 10
- **Docker** e **Docker Compose** (opcional, para subir o PostgreSQL localmente)

---

## Como Começar

```bash
# 1. Clone o repositório
git clone https://github.com/willian-moreno/upload-widget-server.git
cd upload-widget-server

# 2. Instale as dependências
npm install

# 3. Copie e preencha as variáveis de ambiente
cp .env.example .env

# 4. Suba o banco de dados (opcional, via Docker)
docker compose up -d

# 5. Execute as migrations do banco de dados
npm run db:migrate

# 6. Inicie o servidor de desenvolvimento
npm run dev
```

O servidor será iniciado na porta definida no arquivo `.env` (padrão: `3333`).

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`.  
Para os testes, crie um arquivo `.env.test` apontando para um banco de dados dedicado.

```dotenv
PORT=3333
NODE_ENV=development

# Banco de dados
DATABASE_URL="postgresql://docker:docker@localhost:5432/upload"

# Cloudflare R2
CLOUDFLARE_ACCOUNT_ID=seu_account_id
CLOUDFLARE_ACCESS_KEY_ID=sua_access_key_id
CLOUDFLARE_SECRET_ACCESS_KEY=sua_secret_access_key
CLOUDFLARE_BUCKET=nome_do_seu_bucket
CLOUDFLARE_PUBLIC_URL=https://pub-xxxx.r2.dev
```

**`.env.test`** — banco isolado para testes:

```dotenv
PORT=3333
NODE_ENV=test

# Banco de dados
DATABASE_URL="postgresql://docker:docker@localhost:5432/upload_test"

# Cloudflare R2
CLOUDFLARE_ACCOUNT_ID=""
CLOUDFLARE_ACCESS_KEY_ID=""
CLOUDFLARE_SECRET_ACCESS_KEY=""
CLOUDFLARE_BUCKET="upload-widget-server"
CLOUDFLARE_PUBLIC_URL="https://pub-test.r2.dev"
```

> **Atenção:** Nunca versione os arquivos `.env` ou `.env.test`. Adicione-os ao `.gitignore`.

---

## Docker

O projeto inclui um `docker-compose.yml` para subir o PostgreSQL localmente sem instalação manual.

```bash
# Subir o container do PostgreSQL em background
docker compose up -d

# Parar o container
docker compose down
```

Credenciais padrão configuradas no `docker-compose.yml`:

| Parâmetro | Valor    |
| --------- | -------- |
| Usuário   | `docker` |
| Senha     | `docker` |
| Banco     | `upload` |
| Porta     | `5432`   |

> Para os testes, crie manualmente o banco `upload_test` ou ajuste o `DATABASE_URL` no `.env.test`.

---

## Scripts

| Script                    | Descrição                                                         |
| ------------------------- | ----------------------------------------------------------------- |
| `npm run dev`             | Inicia o servidor de desenvolvimento com hot reload (`tsx watch`) |
| `npm test`                | Executa os testes uma vez (usa `.env.test` e migra o BD de teste) |
| `npm run test:watch`      | Executa os testes em modo watch                                   |
| `npm run db:push`         | Aplica alterações do schema diretamente no BD (somente em dev)    |
| `npm run db:generate`     | Gera arquivos de migration a partir das alterações do schema      |
| `npm run db:migrate`      | Aplica as migrations pendentes                                    |
| `npm run db:studio`       | Abre o Drizzle Studio (visualizador do banco de dados)            |
| `npm run db:migrate:test` | Aplica migrations usando o `.env.test`                            |

> Os hooks `pretest` e `pretest:watch` executam `db:migrate:test` automaticamente antes de qualquer rodada de testes.

---

## Banco de Dados

O Drizzle ORM é utilizado para definição de schema e controle de migrations.

- **Schema:** `src/infra/db/schemas/*`
- **Migrations:** `src/infra/db/migrations/`
- **Configuração:** `drizzle.config.ts`

```bash
# Gerar uma nova migration após alterações no schema
npm run db:generate

# Aplicar todas as migrations pendentes
npm run db:migrate

# Abrir o visualizador (Drizzle Studio)
npm run db:studio
```

---

## Documentação da API

Com o servidor em execução, o Swagger UI estará disponível em:

```
http://localhost:{PORT}/docs
```

Todos os endpoints são documentados automaticamente via `@fastify/swagger` com base nos schemas Zod registrados em cada rota.

---

## Testes

Os testes utilizam o **Vitest** e rodam contra um banco de dados dedicado (`.env.test`).

```bash
# Executar todos os testes uma vez
npm test

# Executar os testes em modo watch
npm run test:watch
```

- Dados de teste gerados com `@faker-js/faker`
- Path aliases resolvidos via `vite-tsconfig-paths`
- Migrations aplicadas automaticamente antes de cada rodada pelo hook `pretest`

---

## Autor

**Willian Moreno** — [willian_moreno@outlook.com](mailto:willian_moreno@outlook.com)

---

## Licença

[MIT](https://opensource.org/licenses/MIT)