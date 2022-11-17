# ng.cash tech challenge - mkvlrn@gmail.com

- [pré-requisitos](#pré-requisitos)
- [tl;dr - rodando rapidamente](#tldr---rodando-rapidamente)
- [o stack](#o-stack)
  - [estrutura](#estrutura)
  - [backend](#backend)
  - [database](#database)
  - [frontend](#frontend)
  - [dev/build](#devbuild)
  - [testes](#testes)
  - [qualidade](#qualidade)
- [autenticação](#autenticação)
- [checklist](#checklist)
- [faq](#faq)

## pré-requisitos

- sistema *nix - ubuntu 22.04 (WSL, windows 11) usado
- nodejs LTS - v18.12.1 usada
- yarn - v1.22.19 usada
- docker - v20.10.20 (build 9fdeb9c) usada
- docker compose - v2.12.1 usada
- imagem postgres (docker)
- imagem redis (docker)
- portas abertas e livres:
  - 3001
  - 4001
  - 5432
  - 6379

## tl;dr - rodando rapidamente

clone:

```bash
git clone https://github.com/ng-cash-tech-challenge-mkvlrn/ng-cash-tech-challenge-mkvlrn
```

baixe as imagens (inclusive a do app, é _muito_ mais rápido que construir localmente):

```bash
docker compose pull
```

não quer baixar minha imagem? ok, basta construir:

```bash
docker compose build
```

deps:

```bash
yarn install
```

aplicação no container, disponível em <http://localhost:4001> após subir com:

```bash
docker compose up -d
```

aplicação em dev
precisa de containers com postgres e redis rodando
precisa inicializar o db com as migrations do prisma
backend pode ser acessado diretamente usando a collection do postman contida nesse repo (`ng.cash-tech-challenge.postman_collection.json`)
backend estará disponível em <http://localhost:4001>
frontend estará disponível em <http://localhost:3001>
em terminais separados:

```bash
docker compose up -d db redis
```

```bash
yarn prisma migrate dev
```

```bash
yarn dev:backend
```

```bash
yarn dev:frontend
```

testes
somente unitários, somente pro backend:

```bash
yarn test
```

## o stack

### estrutura

eu não tenho costume de fazer aplicações fullstack no mesmo repo, mas como é parte das regras, decidi usar [yarn workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/), e funcionou legal, depois de uma briga de configuração dos `tsconfig.json` separados

a divisão e compartilhamento de dependências é interessante, mas ainda assim prefiro repositórios separados - questão de gosto

### backend

rest simples, mas tentando ao máximo chegar perto do que o nestjs faz

não é exatamente clean architecture, mas o código e estrutura estão limpos

foram usados:

- [express.js](https://github.com/expressjs/expressjs.com) como framework
- [prisma](https://github.com/prisma) como ORM
- [tsyringe](https://github.com/microsoft/tsyringe) como container de DI

### database

- [postgres](https://www.postgresql.org/) como DB principal
- [redis](https://redis.io/) como sistema de invalidação de JWT

### frontend

é um SPA em react, criado sem um kit(sem next.js, sem CRA), usando vite como base, com configuração manual

usados:

- [mantine](https://github.com/mantinedev/mantine) como lib de estilos
- [react-router-dom](https://github.com/remix-run/react-router) pra rotear e ser um SPA decente
- [recoil](https://github.com/facebookexperimental/Recoil) pro pouquinho de state que existe (context api é _terrível_ 👎👎👎👎👎)

### dev/build

config simples pro tsc transpilar o backend, vite no frontend

durante dev, o backend roda com [nodemon](https://github.com/remy/nodemon) enquanto o front é servido pelo vite mesmo

### testes

só fiz testes unitários e só pro backend, que é o meu forte

é meio complicado testar os controllers/handlers de express.js de forma significativa, mas usando classes deu bem certo

além disso, a API como um todo pode ser testada no postman, usando a collection que tá no repo

eu _sei fazer_, e já fiz testes pra frontend, mas como não é necessariamente requisito e eu não tenho tanto conhecimento a respeito, deixei de fora

### qualidade

uso essas ferramentas em todos os projetos que crio:

- [eslint](https://github.com/eslint/eslint-%20%5Bhttps://github.com/eslint/eslint) como linter, com uma configuração baseada no [guia do airbnb](https://www.npmjs.com/package/eslint-config-airbnb) e algumas mexidas por conta de preferência
- [prettier](https://github.com/prettier/prettier) pra deixar o código 💋 B O N I T O 💋
- [commitlint](https://github.com/conventional-changelog/commitlint) pra forçar um padrão de mensagens de commit, baseado na [especificação conventional commits](https://www.conventionalcommits.org/en/v1.0.0/#specification)
- [lint-staged](https://github.com/okonet/lint-staged) pra rodar tudo isso aí em cima nos arquivos em stage antes de commitar
- [husky](https://github.com/typicode/husky) pra rodar o lint-staged em cada commit

## autenticação

escolhi usar os JWT através de cookies httpOnly ao invés de bearer tokens por simplicidade: não é preciso fazer nada demais no client pra manter as credenciais

as tokens podem ser invalidadas através do logout, que cria entrada no redis pra token usada, com TTL igual ao restante pra expiração da token

no backend o middleware de autenticação também confere o blacklist pra não permitir uso de tokens após logout feito com elas

## checklist

- backend
  - stack base
    - [x] servidor em node.js, utilizando typescript
    - [x] ORM
    - [x] banco postgres
  - arquitetura
    - [x] tabela users
    - [x] tabela accounts
    - [x] tabela transactions
  - regras de negócio
    - [x] cadastro com username/password
    - [x] username único, min de 3 chars
    - [x] password min 8 chars, 1x número, 1x minúscula, 1x maiúscula, hasheada no db
    - [x] account criada junto com usuário, balance de $100, tudo em transaction única
    - [x] login gera jwt, expirando em 24h
    - [x] user vê balance próprio
    - [x] cashout pra outros usuários, impossível self cash out
    - [x] cashout bem sucedido gera item na tabela transactions
    - [x] visualização de transactions onde participou
    - [x] filtragem de transactions por tipo e range de data
- frontend
  - stack base
    - [x] react ou next com typescript
    - [x] css3 ou lib de estilos
  - regras de negócio
    - [x] página de cadastro
    - [x] página de login
      - usuário logado
        - [x] vê balance
        - [x] faz tranferências
        - [x] vê detalhes de transactions
        - [x] filtra transactions
        - [x] faz logout

## faq

**Q: entregando em 3 dias, huh?**

A: sim, eu mantenho [templates pra vários projetos](https://github.com/mkvlrn/typescript-templates) e adaptar pra um projeto fullstack foi bem simples; não tive que repensar a maioria das coisas

---

**Q: não conseguimos fazer rodar, e aí?**

A: funciona na minha máquina!

---

**Q: você commitou arquivos .env porque...?**

A: facilitar a vida de quem vai ter que desbravar o meu código! eu sei que isso não se faz.. mais do que uma vez...

---

**Q: tank, dps, ou healer?**

A: TANK! 🛡️

---

**Q: quando pode começar?**

A: ontem
