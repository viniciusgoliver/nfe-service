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
```

---

## 🔑 Usuários, Clientes e Produtos (Seeds)

Ao rodar o projeto, já serão criados os seguintes registros para facilitar o teste dos endpoints:

### Usuários

| id | Nome  | E-mail                | Senha   | Role  |
|----|-------|-----------------------|---------|-------|
| 1  | Admin | admin@localhost.com   | 123456  | ADMIN |
| 2  | User  | user@localhost.com    | 123456  | USER  |

> **Obs:** Faça login na API para obter o JWT e testar as rotas protegidas!

### Clientes

| id (uuid)                          | Nome      | CNPJ            | IE         |
|-------------------------------------|-----------|-----------------|------------|
| (exemplo) f79ce169-93e5-4158-88e4-6ddf0b8a6eb6 | Client A  | 12345678000190 | 123456789  |
| ...                                 | ...       | ...             | ...        |

### Produtos

| id (uuid)                          | Nome       | Código  | Preço   | CFOP | CST  |
|-------------------------------------|------------|---------|---------|------|------|
| (exemplo) f79f185a-4cc9-44da-9b4b-58b9111caeed | Product 1 | PROD1   | 10.00  | 5102 | 060  |
| ...                                 | ...        | ...     | ...     | ...  | ...  |

> Consulte os registros reais no banco com a rota `/clients` e `/products` (se disponíveis) ou visualize no banco.

---

## 📑 **Plano de Testes Manual – Exemplos de Requisições**

### 1. Login para obter JWT

```bash
curl --request POST http://localhost:3000/auth/signin \
  --header 'Content-Type: application/json' \
  --data '{"email":"user@localhost.com","password":"123456"}'
```
> Copie o access_token do retorno para testar as rotas protegidas.

---

### 2. Emitir NF-e

```bash
curl --request POST \
  --url http://localhost:3000/nfe \
  --header 'Authorization: Bearer {SEU_TOKEN_AQUI}' \
  --header 'Content-Type: application/json' \
  --data '{
    "clientId": "f79ce169-93e5-4158-88e4-6ddf0b8a6eb6",
    "userId": 2,
    "items": [
      {
        "productId": "f79f185a-4cc9-44da-9b4b-58b9111caeed",
        "quantity": 1
      }
    ]
  }'
```

---

### 3. Simular retorno da SEFAZ (Webhook)

```bash
curl --request POST \
  --url http://localhost:3000/nfe/webhook/retorno-sefaz \
  --header 'Authorization: Bearer {SEU_TOKEN_AQUI}' \
  --header 'Content-Type: application/json' \
  --data '{
    "invoiceId": "{INVOICE_ID_AQUI}",
    "status": "AUTHORIZED",
    "protocol": "123456789",
    "xml": "<xml>...</xml>",
    "message": "Nota autorizada com sucesso"
  }'
```

---

### 4. Consultar status da NF-e

```bash
curl --request GET \
  --url http://localhost:3000/nfe/{INVOICE_ID_AQUI} \
  --header 'Authorization: Bearer {SEU_TOKEN_AQUI}'
```

---

### 5. Consultar XML da NF-e

```bash
curl --request GET \
  --url http://localhost:3000/nfe/{INVOICE_ID_AQUI}/xml \
  --header 'Authorization: Bearer {SEU_TOKEN_AQUI}'
```

---

## 📚 Documentação

Acesse a documentação Swagger:  
👉 **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

---

## ✔️ Checklist para Testes Manuais

1. **Autentique com um usuário da seed**
2. **Emita uma NF-e usando um cliente e produto válidos**
3. **Simule o retorno da SEFAZ pelo endpoint de webhook**
4. **Consulte o status e o XML da NF-e**
5. **Teste fluxos de erro: CNPJ inválido, produto inexistente, etc.**
6. **Confira logs detalhados no terminal**


