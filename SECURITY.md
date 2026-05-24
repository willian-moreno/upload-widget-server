# Security Policy

## Supported Versions

Este é um projeto pessoal desenvolvido para fins educacionais durante estudos em desenvolvimento Full-Stack com Node.js, PostgreSQL e upload de arquivos.

Atualmente, apenas a versão mais recente é considerada suportada.

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

---

## Environment

Projeto desenvolvido utilizando:

- Node.js 22
- Fastify
- PostgreSQL
- Drizzle ORM
- AWS SDK / Cloudflare R2
- TypeScript

---

## Reporting a Vulnerability

Mesmo sendo um projeto de estudos, caso encontre alguma vulnerabilidade ou problema relacionado à segurança, você pode entrar em contato através de:

- willian_moreno@outlook.com

Ou abrir uma issue no repositório:

- :contentReference[oaicite:0]{index=0}

---

## Scope

Como este projeto possui finalidade educacional:

- Não há SLA de correção
- Vulnerabilidades podem não ser corrigidas imediatamente
- O projeto não deve ser utilizado em produção sem adaptações e revisão de segurança

---

## Recommendations

Caso utilize este projeto como base para aprendizado:

- Não exponha credenciais reais
- Utilize variáveis de ambiente
- Revise permissões de buckets/storage
- Atualize dependências regularmente
- Execute:

```bash
npm audit
```

## Disclaimer

Este software é fornecido "como está", sem garantias de qualquer tipo, conforme definido pela licença MIT.
