# API de Catálogo de Filmes

API REST em Node.js e Express para cadastro de usuários, autenticação e gerenciamento de filmes. Os filmes são persistidos em MySQL por meio do Prisma ORM.

## Requisitos

- Node.js e npm
- MySQL ou MariaDB
- Um cliente HTTP, como Insomnia, Postman ou `curl`

## Instalação e configuração

Instale as dependências e copie o exemplo de variáveis de ambiente:

```powershell
npm install
Copy-Item .env.example .env
```

No arquivo `.env`, configure um segredo JWT local e `DATABASE_URL` com as credenciais do seu MySQL/MariaDB. Por exemplo:

```env
PORT=3000
JWT_SECRET=defina_uma_chave_longa_e_aleatoria
DATABASE_URL="mysql://USUARIO:SENHA@localhost:3306/NOME_DO_BANCO"
```

Crie/aplique a migration e gere o Prisma Client:

```bash
npx prisma migrate dev --name criar_filmes
npx prisma generate
```

Inicie a API com `npm start` ou `npm run dev`. Ela ficará disponível em `http://localhost:3000`, com a documentação em `http://localhost:3000/api-docs`.

## Rotas

| Método | Caminho | Acesso | Descrição |
| --- | --- | --- | --- |
| `GET` | `/` | Público | Verifica se a API está funcionando |
| `GET` | `/api-docs` | Público | Documentação Swagger |
| `POST` | `/usuarios` | Público | Cadastra usuário |
| `POST` | `/usuarios/login` | Público | Autentica usuário e retorna JWT |
| `POST` | `/filmes` | JWT | Cadastra filme |
| `GET` | `/filmes` | JWT | Lista filmes |
| `GET` | `/filmes/:id` | JWT | Consulta filme por ID |
| `PUT` | `/filmes/:id` | JWT | Atualiza um ou mais campos do filme |
| `DELETE` | `/filmes/:id` | JWT | Exclui filme |
| `POST` | `/upload` | JWT | Envia imagem no campo `imagem` |
| `GET` | `/uploads/:filename` | Público | Acessa uma imagem enviada |

O cadastro exige `titulo`, `diretor`, `ano` e `genero`. A atualização aceita um ou mais desses campos. Um ID inválido retorna `400`; um ID inexistente retorna `404`.

## Exemplo de filme

```json
{
  "titulo": "Interestelar",
  "diretor": "Christopher Nolan",
  "ano": 2014,
  "genero": "Ficção Científica"
}
```

Cadastre um usuário em `/usuarios`, faça login em `/usuarios/login` e envie o JWT retornado no cabeçalho `Authorization: Bearer <token>` às rotas protegidas. As senhas são armazenadas com hash bcrypt e o token JWT expira em uma hora.

O upload aceita JPG, JPEG ou PNG de até 2 MB. Os arquivos ficam em `src/uploads/`; a validação atual considera a extensão do arquivo, não sua assinatura binária.
