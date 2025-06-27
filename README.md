# Mpay Backend Service

## 💻 Pré-requisitos

Antes de começar, verifique se você atendeu aos seguintes requisitos:

- Você instalou a versão minima `nodejs18` testes foram feitos na versão 18
- Você instalou a versão mais recente de `yarn`
- Você tem uma máquina `<Windows / Linux / Mac>`

## 🚀 Clonando e Instalando ``<mpay-backend>``

Para clonar o repositorio `<mpay-backend>`, siga estas etapas:

```bash
git clone git@ssh.dev.azure.com:v3/mpay-backend
```

Para instalar as dependencias `<mpay-backend>`, siga estas etapas:

```bash
yarn install
```

## ⚙️ Configurando ambiente `<mpay-backend>`

Utilizar o arquivo `src/config/env/example.env` como base para a criação do seguinte arquivo de configuração:

- `development.env`

> Aplicação utiliza schema de validação `src/config/validation/validation.ts`, caso não sejam providas a configurações requeridas, resultará em erro.

## ☕ Usando `<mpay-backend>`

Para usar `<mpay-backend>`, siga estas etapas:

```bash
# development
$ yarn start:dev

# production
$ yarn start:prod
```

## Testes

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Gerando arquivo de change log

```bash
yarn release # only changelog file
yarn changelog:minor # x.y.x
yarn changelog:major # y.x.x
yarn changelog:patch # x.x.y
yarn changelog:alpha # x.x.x-alpha.0
```
