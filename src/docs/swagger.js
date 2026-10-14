import swaggerJsdoc from "swagger-jsdoc";

const options = {

    definition: {
        openapi: "3.0.0",

        info: {
            title: "API de Catálogo de Filmes",
            version: "1.0.0",
            description: "API REST de catálogo de filmes desenvolvida para a AV2."
        },

        servers: [
            {
                url: "http://localhost:3000"
            }
        ],

        tags: [
            {
                name: "Filmes",
                description: "Operações relacionadas aos filmes"
            },
            {
                name: "Usuários",
                description: "Cadastro e login de usuários"
            },
            {
                name: "Upload",
                description: "Envio de imagens"
            }
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
                UsuarioCadastro: {
                    type: "object",
                    required: ["nome", "email", "senha"],
                    properties: {
                        nome: { type: "string", example: "Maria" },
                        email: {
                            type: "string",
                            format: "email",
                            example: "maria@gmail.com"
                        },
                        senha: { type: "string", example: "senha123" }
                    }
                },
                UsuarioLogin: {
                    type: "object",
                    required: ["email", "senha"],
                    properties: {
                        email: {
                            type: "string",
                            format: "email",
                            example: "maria@gmail.com"
                        },
                        senha: { type: "string", example: "senha123" }
                    }
                },
                Filme: {
                    type: "object",
                    required: ["titulo", "diretor", "ano", "genero"],
                    properties: {
                        titulo: { type: "string", example: "Interestelar" },
                        diretor: {
                            type: "string",
                            example: "Christopher Nolan"
                        },
                        ano: { type: "integer", example: 2014 },
                        genero: {
                            type: "string",
                            example: "Ficção Científica"
                        }
                    }
                }
            }
        }
    },

    apis: []
};


const swaggerSpec = swaggerJsdoc(options);


// Documentação manual das rotas
swaggerSpec.paths = {

    "/filmes": {

    get: {
        tags: ["Filmes"],
        summary: "Lista todos os filmes",
        security: [
            {
                bearerAuth: []
            }
        ],

        responses: {
            200: {
                description: "Lista de filmes"
            },
            401: {
                description: "Token não informado ou inválido"
            }
        }
    },

    post: {
        tags: ["Filmes"],
        summary: "Cadastra um novo filme",

        security: [
            {
                bearerAuth: []
            }
        ],

        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/Filme"
                    }
                }
            }
        },

        responses: {
            201: {
                description: "Filme cadastrado"
            },
            400: {
                description: "Dados inválidos"
            },
            401: {
                description: "Não autorizado"
            }
        }
    }
},


    "/filmes/{id}": {

        get: {
            tags: ["Filmes"],
            summary: "Consulta um filme pelo ID",

            security: [
                {
                    bearerAuth: []
                }
            ],

            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "integer"
                    }
                }
            ],

            responses: {
                200: {
                    description: "Filme encontrado"
                },
                404: {
                    description: "Filme não encontrado"
                }
            }
        },

        put: {
            tags: ["Filmes"],
            summary: "Edita um filme",

            security: [
                {
                    bearerAuth: []
                }
            ],

            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "integer"
                    }
                }
            ],

            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/Filme"
                        }
                    }
                }
            },

            responses: {
                200: {
                    description: "Filme atualizado"
                },
                404: {
                    description: "Filme não encontrado"
                }
            }
        },

        delete: {
            tags: ["Filmes"],
            summary: "Exclui um filme",

            security: [
                {
                    bearerAuth: []
                }
            ],

            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "integer"
                    }
                }
            ],

            responses: {
                200: {
                    description: "Filme excluído"
                },
                404: {
                    description: "Filme não encontrado"
                }
            }
        }
    },


    "/usuarios": {

    post: {
        tags: ["Usuários"],
        summary: "Cadastra um usuário",

        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/UsuarioCadastro"
                    }
                }
            }
        },

        responses: {
            201: {
                description: "Usuário cadastrado"
            },
            400: {
                description: "Dados obrigatórios não informados"
            }
        }
    }
},


    "/usuarios/login": {

    post: {
        tags: ["Usuários"],
        summary: "Realiza login",

        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/UsuarioLogin"
                    }
                }
            }
        },

        responses: {
            200: {
                description: "Login realizado e token gerado"
            },
            401: {
                description: "Email ou senha incorretos"
            }
        }
    }
},

    "/upload": {

        post: {
            tags: ["Upload"],
            summary: "Envia uma imagem",

            security: [
                {
                    bearerAuth: []
                }
            ],

            requestBody: {
                required: true,
                content: {
                    "multipart/form-data": {
                        schema: {
                            type: "object",
                            required: ["imagem"],
                            properties: {
                                imagem: {
                                    type: "string",
                                    format: "binary",
                                    description: "Arquivo JPG, JPEG ou PNG de até 2 MB",
                                    example: "poster.jpg"
                                }
                            }
                        }
                    }
                }
            },

            responses: {
                201: {
                    description: "Imagem enviada"
                },
                400: {
                    description: "Arquivo inválido"
                },
                401: {
                    description: "Não autorizado"
                },
                500: {
                    description: "Erro ao processar o upload"
                }
            }
        }
    }
};


export default swaggerSpec;