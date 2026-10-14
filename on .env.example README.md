[1mdiff --git a/.env.example b/.env.example[m
[1mindex 3c42ebb..ec6c571 100644[m
[1m--- a/.env.example[m
[1m+++ b/.env.example[m
[36m@@ -1,2 +1,2 @@[m
 PORT=3000[m
[31m-JWT_SECRET=sua_chave_secreta[m
\ No newline at end of file[m
[32m+[m[32mJWT_SECRET=SUBSTITUA_POR_UM_SEGREDO_ALEATORIO_LOCAL[m
\ No newline at end of file[m
[1mdiff --git a/README.md b/README.md[m
[1mindex 3dfad1b..bae3646 100644[m
[1m--- a/README.md[m
[1m+++ b/README.md[m
[36m@@ -9,12 +9,20 @@[m [mProjeto desenvolvido para a AV1 da disciplina de Desenvolvimento de Websites. Es[m
 [m
 ## Instalação e execução[m
 [m
[31m-Instale as dependências e crie um arquivo `.env` a partir de `.env.example`. Configure uma chave JWT própria e não compartilhe nem versione o arquivo `.env`.[m
[32m+[m[32mInstale as dependências:[m
 [m
 ```bash[m
 npm install[m
 ```[m
 [m
[32m+[m[32mNo PowerShell, crie `.env` a partir do exemplo (em outros terminais, use o comando de cópia equivalente):[m
[32m+[m
[32m+[m[32m```powershell[m
[32m+[m[32mCopy-Item .env.example .env[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32mSubstitua `JWT_SECRET` por um valor aleatório mantido apenas no ambiente local. O arquivo de exemplo contém placeholders, não credenciais de produção.[m
[32m+[m
 Exemplo de configuração local:[m
 [m
 ```env[m
[36m@@ -31,6 +39,19 @@[m [mnpm run dev[m
 [m
 A API ficará disponível em `http://localhost:3000` (ou na porta definida em `PORT`). A interface Swagger está em `http://localhost:3000/api-docs`.[m
 [m
[32m+[m[32m## Estrutura do projeto[m
[32m+[m
[32m+[m[32m```text[m
[32m+[m[32mserver.js                 Inicializa o servidor[m
[32m+[m[32msrc/app.js                Configura o Express, middlewares e rotas[m
[32m+[m[32msrc/controllers/          Lógica de usuários e filmes[m
[32m+[m[32msrc/data/                 Arrays compartilhados e geradores de IDs[m
[32m+[m[32msrc/routes/               Rotas de usuários, filmes e upload[m
[32m+[m[32msrc/middleware/auth.js    Autenticação JWT[m
[32m+[m[32msrc/docs/swagger.js       Especificação OpenAPI[m
[32m+[m[32msrc/uploads/              Arquivos enviados (novos uploads são ignorados pelo Git)[m
[32m+[m[32m```[m
[32m+[m
 ## Rotas[m
 [m
 | Método | Caminho | Acesso | Descrição |[m
[36m@@ -52,6 +73,8 @@[m [mA validação do upload verifica a extensão informada no nome do arquivo; ela n[m
 [m
 Cadastre um usuário em `POST /usuarios` e envie as credenciais a `POST /usuarios/login`. As senhas são armazenadas com hash bcrypt e não são incluídas nas respostas. O login retorna um JWT válido por uma hora.[m
 [m
[32m+[m[32mO cadastro recebe JSON no formato `{"nome":"Maria","email":"maria@example.com","senha":"uma-senha"}`. Em seguida, envie `{"email":"maria@example.com","senha":"uma-senha"}` ao login e copie o campo `token` da resposta para as requisições protegidas.[m
[32m+[m
 Nas rotas protegidas, envie o token no cabeçalho:[m
 [m
 ```text[m
[1mdiff --git a/package.json b/package.json[m
[1mindex ae552e6..3a643c2 100644[m
[1m--- a/package.json[m
[1m+++ b/package.json[m
[36m@@ -2,7 +2,7 @@[m
   "name": "av-dwb-api-express-filmes-1",[m
   "version": "1.0.0",[m
   "description": "",[m
[31m-  "main": "index.js",[m
[32m+[m[32m  "main": "server.js",[m
   "scripts": {[m
     "start": "node server.js",[m
     "dev": "nodemon server.js"[m
