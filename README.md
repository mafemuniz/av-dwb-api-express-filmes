# API Catálogo de Filmes

Projeto desenvolvido para a AV1 da disciplina de Desenvolvimento de Websites.

## Sobre o projeto

Esta aplicação é uma API REST desenvolvida com Node.js e Express para simular um catálogo de filmes.

Os dados são armazenados temporariamente em memória utilizando uma lista de objetos JavaScript.

## Tecnologias utilizadas

* Node.js
* Express
* JavaScript
* Insomnia
* GitHub

## Funcionalidades

A API permite:

* cadastrar filmes;
* listar filmes;
* consultar filme por ID;
* editar filmes;
* excluir filmes.

## Rotas

### Cadastrar filme

```text
POST /filmes
```

### Listar filmes

```text
GET /filmes
```

### Consultar filme por ID

```text
GET /filmes/:id
```

### Editar filme

```text
PUT /filmes/:id
```

### Excluir filme

```text
DELETE /filmes/:id
```

## Como executar

Primeiro, instale as dependências:

```bash
npm install
```

Depois execute:

```bash
npm start
```

O servidor será iniciado em:

```text
http://localhost:3000
```

## Exemplo de cadastro

```json
{
    "titulo": "Interestelar",
    "diretor": "Christopher Nolan",
    "ano": 2014,
    "genero": "Ficção Científica"
}
```

## Observação

Os dados são armazenados apenas enquanto o servidor estiver em execução. Ao desligar o servidor, os dados são perdidos.
