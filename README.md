# NF-e Service

Microserviço para emissão e gerenciamento de Notas Fiscais Eletrônicas (NF-e), desenvolvido em Node.js (NestJS), Prisma ORM e PostgreSQL.

---

## 🚀 Funcionalidades

- **Cadastro e autenticação de usuários** (JWT)
- **Emissão, consulta e listagem de NF-e**
- **Validação de XML via XSD**
- **Fila assíncrona** para processamento das notas
- **Recuperação e confirmação de e-mail**
- **Documentação OpenAPI/Swagger** (endpoint `/api/docs`)
- **Infraestrutura pronta para Docker**

---

## ⚙️ Tecnologias Principais

- **Node.js 20+** / NestJS
- **Prisma ORM**
- **PostgreSQL**
- **Docker & Docker Compose**
- **JWT Authentication**
- **Jest** (unitário e E2E)
- **Winston Logger**
- **Husky, ESLint, Prettier, Commitlint**

---

## 🏁 Como rodar localmente

```bash
# Clone o repositório
git clone https://github.com/viniciusgoliver/nfe-service.git
cd nfe-service

# Configure as variáveis de ambiente
cp dev.env .env

# Suba o ambiente (aplicação, banco e dependências)
docker-compose up --build

# Rode as migrations (inicializa o banco de dados)
docker-compose exec app npx prisma migrate deploy
