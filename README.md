# NF-e Service

Microserviço para emissão e gerenciamento de Notas Fiscais Eletrônicas (NF-e), desenvolvido em Node.js com NestJS, Prisma ORM e PostgreSQL.

## 🚀 Funcionalidades

- Cadastro e autenticação de usuários (JWT)
- Emissão, consulta e listagem de NF-e
- Validação XML via XSD
- Fila assíncrona para processamento de notas
- Recuperação e confirmação de email
- Documentação OpenAPI/Swagger
- Infraestrutura pronta para Docker

## ⚙️ Tecnologias

- Node.js 18+ / NestJS
- Prisma ORM
- PostgreSQL
- Docker / Docker Compose
- JWT Auth
- Jest (unit e2e)
- Winston Logger
- Husky, Eslint, Prettier, Commitlint

## 🏁 Como rodar localmente

```bash
git clone https://github.com/viniciusgoliver/nfe-service.git
cd nfe-service

cp dev.env .env

docker-compose up --build

docker-compose exec app npx prisma migrate deploy
