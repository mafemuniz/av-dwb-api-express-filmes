# API de Catálogo de Filmes

Projeto desenvolvido para a AV1 da disciplina de Desenvolvimento de Websites. Esta API REST usa Node.js e Express para cadastrar usuários, autenticar operações protegidas e gerenciar um catálogo de filmes.

## Requisitos

- Node.js e npm
- Um cliente HTTP, como Insomnia, Postman ou `curl`

## Instalação e execução

Instale as dependências:

```bash
npm install
```

No PowerShell, crie `.env` a partir do exemplo (em outros terminais, use o comando de cópia equivalente):

```powershell
Copy-Item .env.example .env
```

Substitua `JWT_SECRET` por um valor aleatório mantido apenas no ambiente local. O arquivo de exemplo contém placeholders, não credenciais de produção.

Exemplo de configuração local:

```env
PORT=3000
JWT_SECRET=defina_uma_chave_longa_e_aleatoria
```

Inicie o servidor normalmente ou em modo de desenvolvimento com reinicialização automática:

```bash
npm start
npm run dev
```

A API ficará disponível em `http://localhost:3000` (ou na porta definida em `PORT`). A interface Swagger está em `http://localhost:3000/api-docs`.

## Estrutura do projeto

```text
server.js                 Inicializa o servidor
src/app.js                Configura o Express, middlewares e rotas
src/controllers/          Lógica de usuários e filmes
src/data/                 Arrays compartilhados e geradores de IDs
src/routes/               Rotas de usuários, filmes e upload
src/middleware/auth.js    Autenticação JWT
src/docs/swagger.js       Especificação OpenAPI
src/uploads/              Arquivos enviados (novos uploads são ignorados pelo Git)
```

## Rotas

| Método | Caminho | Acesso | Descrição |
| --- | --- | --- | --- |
| `POST` | `/usuarios` | Público | Cadastra usuário com `nome`, `email` e `senha` |
| `POST` | `/usuarios/login` | Público | Valida credenciais e retorna JWT |
| `POST` | `/filmes` | JWT | Cadastra filme |
| `GET` | `/filmes` | JWT | Lista filmes |
| `GET` | `/filmes/:id` | JWT | Consulta filme por ID |
| `PUT` | `/filmes/:id` | JWT | Atualiza filme |
| `DELETE` | `/filmes/:id` | JWT | Exclui filme |
| `POST` | `/upload` | JWT | Envia imagem no campo `imagem` |

O cadastro de filmes recebe JSON com `titulo`, `diretor`, `ano` e `genero`. A atualização substitui esses mesmos campos. O upload aceita JPG, JPEG ou PNG com tamanho máximo de 2 MB; os arquivos são armazenados em `src/uploads/`.

A validação do upload verifica a extensão informada no nome do arquivo; ela não inspeciona o conteúdo binário nem garante, sozinha, que o arquivo seja seguro.

## Autenticação

Cadastre um usuário em `POST /usuarios` e envie as credenciais a `POST /usuarios/login`. As senhas são armazenadas com hash bcrypt e não são incluídas nas respostas. O login retorna um JWT válido por uma hora.

O cadastro recebe JSON no formato `{"nome":"Maria","email":"maria@example.com","senha":"uma-senha"}`. Em seguida, envie `{"email":"maria@example.com","senha":"uma-senha"}` ao login e copie o campo `token` da resposta para as requisições protegidas.

Nas rotas protegidas, envie o token no cabeçalho:

```text
Authorization: Bearer <token>
```

## Exemplo de filme

```json
{
    "titulo": "Interestelar",
    "diretor": "Christopher Nolan",
    "ano": 2014,
    "genero": "Ficção Científica"
}
```

## Armazenamento

Usuários e filmes ficam em arrays em memória, sem banco de dados. Esses registros desaparecem quando o servidor reinicia. Os arquivos enviados são gravados no diretório `src/uploads/`.
