# Programador AO | API

## Funcionalidades

- Autenticação
	- [x] Cadastro com Email\Telefone\NomeUsuario e Senha
	- [] Cadastro com Google
	- [] Cadastro com Github
	- [x] Login com senha
	- [] Login com Google
	- [] Login com Github
	- Alteração de Senha
		- [x] Alterar senha
		- [] Actualizar token\sessão para invalidar o token antigo
	- [] Verificação de email
	- [] Verificar Telefone
	- [] Sessões
		- [] Terminar sessão
		- [] Listar sessões por usuario
		- [] Anular Sessão
		- [] Actualizar token\sessão para invalidar o token antigo
	- [] Apagar Conta
	- [x] Actualizar dados conta
	- [] Detalhes da conta 
		- Id do Usuario
		- nome
		- ultimo login
		- email
		- email verificado
		- Telefone 
		- Telefone verificado
		- Provedor | Provedor Id do usuario
		- Modo de autenticação
		- Tipo usuário 
		- Permissões
	
	- [] Autorização
		- [] Cadastrar permissões
		- [] Listar permissões
		- [] Dar permissão
		- [] Remover permissão [do usuario]
	
- Gerenciamento de Projectos
- Gerenciamento de Eventos

## Modelagem\Implementação

### Autenticação

Implementação e integração  com [supertokens](https://supertokens.com/)

### Projectos
- Nome do projecto
- resumo do projecto
- Sobre o projecto
- Redes Sociais
- Github
- Link do projecto
- Data lançamento
- Data actualização
- Pontos\Classificação
- Comentários
 
### Eventos
- Titulo do evento
- Descrição do evento
- Localização
- Data & Hora
- Modalidade [online, presencial]