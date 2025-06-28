# NF-e Service

![CI](https://github.com/viniciusgoliver/nfe-service/actions/workflows/ci.yml/badge.svg)

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

## 🤖 Integração Contínua (CI/CD)

Este projeto conta com **pipeline automatizado de CI/CD** usando **GitHub Actions** (`.github/workflows/ci.yml`).

A cada push ou pull request, o pipeline executa automaticamente:

- Instalação de dependências
- Lint de código (`yarn lint`)
- Build da aplicação
- Testes unitários (`yarn test`)
- Testes de integração/end-to-end (`yarn test:e2e`)
- Sobe um banco de dados PostgreSQL isolado em container para os testes

Isso garante qualidade, rastreabilidade e validação de todo código antes de ser integrado à branch principal.

---

## 📝 Observações

- **O serviço de envio à SEFAZ está simulado nesta versão.**
- **Toda a validação de NF-e e processamento é feita localmente, garantindo isolamento e segurança para rodar/testar sem dependências externas.**
- **Para integração real, basta adaptar o método de envio em `InvoiceService` para consumir o webservice oficial da SEFAZ conforme documentação técnica do órgão.**

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
```
