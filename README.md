Esse projeto foi criado com o objetivo de estudar o Keycloak e gerar um simples Boilerplate para outros projetos que necessitarem do uso dele.

## Tecnologias utilizadas
- Laravel (Backend)
- NextJs (Front)
- Keycloak (Servidor de identidade)
- Docker (Conteiners)

## Iniciar o projeto

Primeiro, suba os containers estruturados no docker-compose.yml com o seguinte comando

```bash
docker-compose up -d
# or
docker compose up -d
```

## Configuração do Keycloak
1 - Após todos os containers estarem de pé, acesse o [keycloak](http://localhost:8080) para importas essas configurações.
2 - Na tela de login do Keycloak, informe "admin" para o usuário e para a senha.
3 - No Menu do Keycloak, existe um select escrito "Master" que é o realm, você precisa clicar ali e depois clicar em "Create Realm".
4 - Nessa tela de criação você deve importar o json que esta na pasta "Keycloak".
5 - Crie um usuário dentro do keycloak.

## Testando a aplicação
- Acesse o [frontend](http://localhost:3000) e explore ;)
