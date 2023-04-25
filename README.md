# Programador AO | API

Repositório da [API](http://github.com/Programador-AO/programador-ao-api) da plataforma Programador AO, construído pela comunidade

## [Tecnologias](/docs/tecnologias.md)

- [NestJS](https://www.fastify.io/) | Framework
- [Prisma](https://www.prisma.io/) | Modelagem da base de dados
- [TypeScript](https://www.typescriptlang.org/) | Linguagem de Programação
- [MySQL](https://www.mysql.com/) | Gerenciador de base de dados
- [Microserviços](https://microservices.io/) | Padrão de desenvolvimento
- [Insomnia ou outro aplicativo para testar a API](https://insomnia.rest/download) | Testes da API
- [Swagger](https://swagger.io/) | Documentação da API

## [Funcionalidades](/docs/funcionalidades.md)

- Autenticação
- Gerenciamento de Projectos
- Gerenciamento de Eventos
  - Convidar pessoas

## Instalação e execução do projeto

```bash
git clone https://github.com/programador-ao/programador-ao-api

cd programador-ao-api\src

npm install
```

### Configuração das variáveis de ambiente

copia o arquivo `.env.example` e renomeia a copia para `.env` e preencha as variáveis `JWT_SECRET`, `JWT_EXPIRE` e `DATABASE_URL` e `PORT` caso não queira que execute na porta padrão `3000`

```sh
# Exemplo
JWT_SECRET = 'alguma-coisa-qualquer'

# Exemplo: 10h, 7d 
JWT_EXPIRE = '30d'

# DATABASE_URL = 'mysql://nome-usuario:@host:port/nome-base-de-dados'
DATABASE_URL = 'mysql://root:@localhost:3306/programador_ao_db' 
```

## Executando as migrations

```bash
npx run migration
```

### Executando o projecto

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Teste

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Criar a build

```bash
# build (pasta: dist)
npm run build

```

## Suporte

Programador AO | API é um projeto de código aberto com a licença MIT. Pode crescer graças aos membros e ao apoio dos incríveis contribuidores. Se você quiser se juntar a nós, [leia mais aqui](https://programador.ao/sobre-nos).

## Contato

- Website - [https://programador.ao](https://programador.ao/)
- Facebook - [@programadoraoo](https://web.facebook.com/programadoraoo)
- YouTube - [@programadorao](https://www.youtube.com/@programadorao)
- Instagram - [@programadorao](https://www.instagram.com/programadorao/)

## Contribuidores

- Github - [@peal-26](https://github.com/peal-26/)

## Licença

API is [MIT licensed](LICENSE).
