# Nfe Service

## 💻 Pré-requisitos

Antes de começar, verifique se você atendeu aos seguintes requisitos:

- Você instalou a versão minima `nodejs20` testes foram feitos na versão 18
- Você instalou a versão mais recente de `yarn`
- Você tem uma máquina `<Windows / Linux / Mac>`

## 🚀 Clonando e Instalando ``<nfe-service>``

Para clonar o repositorio `<nfe-service>`, siga estas etapas:

```bash
git clone git@github.com:viniciusgoliver/nfe-service.git
```

Para instalar as dependencias `<nfe-service>`, siga estas etapas:

```bash
yarn install
```

## ⚙️ Configurando ambiente `<nfe-service>`

Utilizar o arquivo `src/dev.env` como base para a criação do seguinte arquivo de configuração:

- `dev.env`

> Aplicação utiliza schema de validação `src/config/validation/validation.ts`, caso não sejam providas a configurações requeridas, resultará em erro.

## ☕ Usando `<nfe-service>`

Para usar `<nfe-service>`, siga estas etapas:

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
