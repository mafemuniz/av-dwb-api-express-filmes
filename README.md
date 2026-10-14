# API de Catálogo de Filmes

Projeto desenvolvido para a AV1 da disciplina de Desenvolvimento de Websites. Esta API REST usa Node.js e Express para cadastrar usuários, autenticar operações protegidas e gerenciar um catálogo de filmes.

## Requisitos

- Node.js e npm
- Um cliente HTTP, como Insomnia, Postman ou `curl`

## Instalação e execução

Instale as dependências e crie um arquivo `.env` a partir de `.env.example`. Configure uma chave JWT própria e não compartilhe nem versione o arquivo `.env`.

```bash
npm install
```

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

## Autenticação

Cadastre um usuário em `POST /usuarios` e envie as credenciais a `POST /usuarios/login`. As senhas são armazenadas com hash bcrypt e não são incluídas nas respostas. O login retorna um JWT válido por uma hora.

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
