import swaggerJsdoc from "swagger-jsdoc";

const options = {

    definition: {
        openapi: "3.0.0",

        info: {
            title: "API Catálogo de Filmes",
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
                        type: "object",
                        required: [
                            "titulo",
                            "diretor",
                            "ano",
                            "genero"
                        ],
                        properties: {
                            titulo: {
                                type: "string",
                                example: "Interestelar"
                            },
                            diretor: {
                                type: "string",
                                example: "Christopher Nolan"
                            },
                            ano: {
                                type: "integer",
                                example: 2014
                            },
                            genero: {
                                type: "string",
                                example: "Ficção Científica"
                            }
                        }
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
                        type: "object",
                        required: ["nome", "email", "senha"],
                        properties: {
                            nome: {
                                type: "string",
                                example: "Maria"
                            },
                            email: {
                                type: "string",
                                example: "maria@gmail.com"
                            },
                            senha: {
                                type: "string",
                                example: "123456"
                            }
                        }
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
                        type: "object",
                        required: ["email", "senha"],
                        properties: {
                            email: {
                                type: "string",
                                example: "maria@gmail.com"
                            },
                            senha: {
                                type: "string",
                                example: "123456"
                            }
                        }
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

            responses: {
                201: {
                    description: "Imagem enviada"
                },
                400: {
                    description: "Arquivo inválido"
                },
                401: {
                    description: "Não autorizado"
                }
            }
        }
    }
};


export default swaggerSpec;