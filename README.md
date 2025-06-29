# NF-e Service

![CI](https://github.com/viniciusgoliver/nfe-service/actions/workflows/ci.yml/badge.svg)
![Node](https://img.shields.io/badge/node-20+-brightgreen)
![License](https://img.shields.io/github/license/viniciusgoliver/nfe-service)
![Last Commit](https://img.shields.io/github/last-commit/viniciusgoliver/nfe-service)
![Docker](https://img.shields.io/badge/docker-ready-blue)

Microserviço para emissão e gerenciamento de Notas Fiscais Eletrônicas (NF-e), desenvolvido com **Node.js (NestJS)**, **Prisma ORM** e **PostgreSQL**.

---

## 🚀 Funcionalidades

- Cadastro e autenticação de usuários (JWT)
- Emissão, consulta e listagem de NF-e
- Validação de XML via XSD
- Fila assíncrona para processamento das notas
- Recuperação e confirmação de e-mail
- Documentação automática (OpenAPI/Swagger) em `/api/docs`
- Infraestrutura pronta para Docker
- Validação e tratamento de erros globais
- Logs estruturados (Winston)
- Testes unitários e E2E (Jest)
- CI/CD automatizado (GitHub Actions)

---

## ⚙️ Tecnologias Utilizadas

- Node.js 20+
- NestJS
- Prisma ORM
- PostgreSQL
- Docker & Docker Compose
- JWT Authentication
- Jest (unitário e E2E)
- Winston Logger
- Husky, ESLint, Prettier, Commitlint
- Swagger/OpenAPI

---

## 🤖 Integração Contínua e Entrega Contínua (CI/CD)

O projeto conta com pipelines automatizados usando **GitHub Actions**:

- `ci.yml` – Execução de lint, build, testes unitários e E2E, rodando em banco de dados isolado.
- `pipeline.yml` – Arquivo intermediário para lógica customizada (agendamento, aprovação, etc.).
- `cd.yml` – Etapa de deploy (ajuste conforme necessidade).

O que é executado automaticamente:

- Instalação de dependências
- Lint de código (`yarn lint`)
- Build da aplicação
- Testes unitários (`yarn test`)
- Testes E2E/integrados (`yarn test:e2e`)
- Banco PostgreSQL isolado via Docker

---

## 🎯 Padrões e Qualidade

- **ESLint + Prettier**: Padronização automática do código (com customizações necessárias).
- **Husky + Commitlint**: Convencional Commit e bloqueio de pushes fora do padrão.
- **Estrutura organizada por camadas**: Separação clara de controllers, services, repositories, DTOs, guards, filters, interceptors etc.
- **Testes automatizados**: Cobrindo fluxo de emissão, autenticação e integrações principais.

---

## 📝 Observações

- O serviço de envio à SEFAZ está **simulado** nesta versão.
- Toda a validação e processamento de NF-e é local e independente de integrações externas.
- Para integração real, adapte o método de envio em `InvoiceService` para consumir o webservice da SEFAZ conforme normas técnicas.
- As regras do ESLint foram ajustadas para produtividade e aderência ao time.

---

## 🏁 Como rodar localmente

```bash
git clone https://github.com/viniciusgoliver/nfe-service.git
cd nfe-service

cp dev.env .env

yarn docker:up

yarn migrate:deploy


