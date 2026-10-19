import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API de Catálogo de Filmes",
            version: "1.0.0",
            description: "API REST para cadastro de usuários, autenticação e gerenciamento de um catálogo de filmes. Os dados de usuários e filmes são mantidos em memória."
        },
        servers: [{ url: "/", description: "Servidor atual" }],
        tags: [
            { name: "API", description: "Estado da API" },
            { name: "Filmes", description: "Operações relacionadas aos filmes" },
            { name: "Usuários", description: "Cadastro e login de usuários" },
            { name: "Upload", description: "Envio e acesso a imagens" }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            },
            schemas: {
                Filme: {
                    type: "object",
                    required: ["titulo", "diretor", "ano", "genero"],
                    properties: {
                        id: { type: "integer", readOnly: true, example: 1 },
                        titulo: { type: "string", example: "Interestelar" },
                        diretor: { type: "string", example: "Christopher Nolan" },
                        ano: { type: "integer", example: 2014 },
                        genero: { type: "string", example: "Ficção Científica" }
                    }
                },
                UsuarioCadastro: {
                    type: "object",
                    required: ["nome", "email", "senha"],
                    properties: {
                        nome: { type: "string", example: "Maria" },
                        email: { type: "string", format: "email", example: "maria@example.com" },
                        senha: { type: "string", format: "password", example: "uma-senha" }
                    }
                },
                UsuarioLogin: {
                    type: "object",
                    required: ["email", "senha"],
                    properties: {
                        email: { type: "string", format: "email", example: "maria@example.com" },
                        senha: { type: "string", format: "password", example: "uma-senha" }
                    }
                },
                Erro: {
                    type: "object",
                    properties: {
                        erro: { type: "string", example: "Dados inválidos." }
                    }
                }
            }
        }
    },
    apis: []
};

const swaggerSpec = swaggerJsdoc(options);

swaggerSpec.paths = {
    "/": {
        get: {
            tags: ["API"],
            summary: "Verifica se a API está funcionando",
            responses: {
                200: {
                    description: "API operacional",
                    content: {
                        "application/json": {
                            example: { mensagem: "API de Catálogo de Filmes funcionando!" }
                        }
                    }
                }
            }
        }
    },
    "/filmes": {
        get: {
            tags: ["Filmes"],
            summary: "Lista todos os filmes",
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: "Lista de filmes",
                    content: {
                        "application/json": {
                            schema: { type: "array", items: { $ref: "#/components/schemas/Filme" } }
                        }
                    }
                },
                401: { description: "Token ausente ou inválido" },
                500: { description: "Erro interno ao consultar filmes" }
            }
        },
        post: {
            tags: ["Filmes"],
            summary: "Cadastra um filme",
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: { "application/json": { schema: { $ref: "#/components/schemas/Filme" } } }
            },
            responses: {
                201: { description: "Filme cadastrado", content: { "application/json": { schema: { $ref: "#/components/schemas/Filme" } } } },
                400: { description: "Campos obrigatórios ou ano inválidos", content: { "application/json": { schema: { $ref: "#/components/schemas/Erro" } } } },
                401: { description: "Token ausente ou inválido" },
                500: { description: "Erro interno ao cadastrar filme" }
            }
        }
    },
    "/filmes/{id}": {
        parameters: [{
            name: "id",
            in: "path",
            required: true,
            description: "ID inteiro positivo do filme",
            schema: { type: "integer", minimum: 1 }
        }],
        get: {
            tags: ["Filmes"],
            summary: "Consulta um filme pelo ID",
            security: [{ bearerAuth: [] }],
            responses: {
                200: { description: "Filme encontrado", content: { "application/json": { schema: { $ref: "#/components/schemas/Filme" } } } },
                400: { description: "ID inválido" },
                401: { description: "Token ausente ou inválido" },
                404: { description: "Filme não encontrado" }
            }
        },
        put: {
            tags: ["Filmes"],
            summary: "Atualiza os dados de um filme",
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: { "application/json": { schema: { $ref: "#/components/schemas/Filme" } } }
            },
            responses: {
                200: { description: "Filme atualizado", content: { "application/json": { schema: { $ref: "#/components/schemas/Filme" } } } },
                400: { description: "ID ou dados do filme inválidos" },
                401: { description: "Token ausente ou inválido" },
                404: { description: "Filme não encontrado" }
            }
        },
        delete: {
            tags: ["Filmes"],
            summary: "Exclui um filme",
            security: [{ bearerAuth: [] }],
            responses: {
                200: { description: "Filme excluído" },
                400: { description: "ID inválido" },
                401: { description: "Token ausente ou inválido" },
                404: { description: "Filme não encontrado" }
            }
        }
    },
    "/usuarios": {
        post: {
            tags: ["Usuários"],
            summary: "Cadastra um usuário",
            requestBody: {
                required: true,
                content: { "application/json": { schema: { $ref: "#/components/schemas/UsuarioCadastro" } } }
            },
            responses: {
                201: { description: "Usuário cadastrado; a senha não é retornada" },
                400: { description: "Nome, email ou senha inválidos" },
                409: { description: "Email já cadastrado" },
                500: { description: "Erro interno ao cadastrar usuário" }
            }
        }
    },
    "/usuarios/login": {
        post: {
            tags: ["Usuários"],
            summary: "Autentica um usuário e retorna um JWT válido por uma hora",
            requestBody: {
                required: true,
                content: { "application/json": { schema: { $ref: "#/components/schemas/UsuarioLogin" } } }
            },
            responses: {
                200: { description: "Login realizado e token retornado" },
                400: { description: "Email ou senha ausentes" },
                401: { description: "Email ou senha incorretos" },
                500: { description: "Erro de configuração ou erro interno" }
            }
        }
    },
    "/upload": {
        post: {
            tags: ["Upload"],
            summary: "Envia uma imagem para o catálogo",
            description: "Rota autenticada. Aceita JPG, JPEG ou PNG de até 2 MB; a validação atual é baseada na extensão do nome do arquivo.",
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "multipart/form-data": {
                        schema: {
                            type: "object",
                            required: ["imagem"],
                            properties: {
                                imagem: { type: "string", format: "binary", description: "Arquivo JPG, JPEG ou PNG de até 2 MB" }
                            }
                        }
                    }
                }
            },
            responses: {
                201: { description: "Imagem enviada; o caminho público é retornado" },
                400: { description: "Arquivo ausente, inválido ou acima do limite" },
                401: { description: "Token ausente ou inválido" },
                500: { description: "Erro ao processar o upload" }
            }
        }
    },
    "/uploads/{filename}": {
        get: {
            tags: ["Upload"],
            summary: "Acessa uma imagem enviada",
            parameters: [{ name: "filename", in: "path", required: true, schema: { type: "string" } }],
            responses: {
                200: { description: "Arquivo de imagem" },
                404: { description: "Imagem não encontrada" }
            }
        }
    }
};

export default swaggerSpec;
