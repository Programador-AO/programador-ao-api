# Programador AO | API

## [Tecnologias](/docs/tecnologias.md)

- [NestJS](https://www.fastify.io/) | Framework
- [Prisma](https://www.prisma.io/) | Modelagem da base de dados
- [TypeScript](https://www.typescriptlang.org/) | Linguagem de Programação
- [MySQL](https://www.mysql.com/) | Gerenciador de base de dados
- [Supertokens](https://supertokens.com/) | Autenticação de Usuário
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

### Instalação do Supertokens

- Baixe o arquivo zip SuperTokens para o seu sistema operacional

```bash
curl 'https://api.supertokens.com/0/user/app/download?pluginName=mysql&os=linux&core=4.6&api-version=0' --output supertokens.zip
```

Uma vez baixado, extraia o zip e você verá uma pasta chamada supertokens

```bash
cd supertokens
sudo ./install
```

#### Conecte SuperTokens ao seu banco de dados

- Você precisa adicionar ao arquivo config.yaml o seguinte:
- O caminho do arquivo pode ser encontrado executando o comando "supertokens --help"

```bash
mysql_connection_uri: "mysql://username:pass@host/dbName"
```

#### Iniciar SuperTokens

```bash
supertokens start
```

### Executando o projecto

```bash
# local development
npm run start:local

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

Programador AO | API é um projeto de código aberto licenciado pelo MIT. Pode crescer graças aos patrocinadores e ao apoio dos incríveis patrocinadores. Se você quiser se juntar a eles, [leia mais aqui](https://programador.ao/sobre-nos).

## Contato

- Website - [https://programador.ao](https://programador.ao/)
- Facebook - [@programadoraoo](https://web.facebook.com/programadoraoo)
- YouTube - [@programadorao](https://www.youtube.com/@programadorao)
- Instagram - [@programadorao](https://www.instagram.com/programadorao/)

## Contribuidores

- Github - [@peal-26](https://github.com/peal-26/)

## Licença

API is [MIT licensed](LICENSE).
